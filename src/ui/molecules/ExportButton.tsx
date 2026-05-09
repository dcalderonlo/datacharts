'use client'
import { useState, useRef } from 'react'
import { Button } from '@/ui/atoms/Button'

type ExportFormat = 'csv' | 'pdf'

interface ExportButtonProps {
  data: unknown[]
  filename: string
  format?: ExportFormat
}

function exportCSV(data: unknown[], filename: string) {
  if (!data.length) return
  const keys = Object.keys(data[0] as Record<string, unknown>)
  const rows = [
    keys.join(','),
    ...data.map((row) =>
      keys.map((k) => {
        const val = (row as Record<string, unknown>)[k]
        const str = val === null || val === undefined ? '' : String(val)
        return `"${str.replace(/"/g, '""')}"`
      }).join(',')
    ),
  ]
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

async function exportPDF(data: unknown[], filename: string) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text(filename, 14, 18)
  doc.setFontSize(9)

  if (!data.length) {
    doc.text('No data available.', 14, 30)
  } else {
    const keys = Object.keys(data[0] as Record<string, unknown>)
    const colWidth = 180 / keys.length
    let y = 30

    // Header
    keys.forEach((k, i) => doc.text(k, 14 + i * colWidth, y))
    y += 7

    data.forEach((row) => {
      if (y > 270) { doc.addPage(); y = 20 }
      keys.forEach((k, i) => {
        const val = (row as Record<string, unknown>)[k]
        doc.text(val === null || val === undefined ? '' : String(val), 14 + i * colWidth, y)
      })
      y += 6
    })
  }

  doc.save(`${filename}.pdf`)
}

export function ExportButton({ data, filename, format }: ExportButtonProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  async function handleExport(fmt: ExportFormat) {
    setOpen(false)
    setIsLoading(true)
    try {
      if (fmt === 'csv') exportCSV(data, filename)
      else await exportPDF(data, filename)
    } finally {
      setIsLoading(false)
    }
  }

  // If format is fixed, render single button
  if (format) {
    return (
      <Button
        variant="secondary"
        isLoading={isLoading}
        onClick={() => handleExport(format)}
      >
        Export {format.toUpperCase()}
      </Button>
    )
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <Button variant="secondary" isLoading={isLoading} onClick={() => setOpen((o) => !o)}>
        Export ▾
      </Button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
            onClick={() => handleExport('pdf')}
          >
            Export PDF
          </button>
        </div>
      )}
    </div>
  )
}
