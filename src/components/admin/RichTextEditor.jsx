"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

export function RichTextEditor({ value, onChange, label, placeholder, rows = 15 }) {
  const [showPreview, setShowPreview] = useState(false)
  const [uploading, setUploading] = useState(false)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  // Helper function to insert text at cursor position
  const insertAtCursor = (before, after = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end)

    onChange(newText)

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const wrapSelection = (before, after) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    if (selectedText) {
      const newText =
        value.substring(0, start) +
        before +
        selectedText +
        after +
        value.substring(end)
      onChange(newText)

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, end + before.length)
      }, 0)
    } else {
      insertAtCursor(before, after)
    }
  }

  const handleBold = () => wrapSelection('<strong>', '</strong>')
  const handleItalic = () => wrapSelection('<em>', '</em>')
  const handleUnderline = () => wrapSelection('<u>', '</u>')
  const handleH1 = () => insertAtCursor('\n<h1>', '</h1>\n')
  const handleH2 = () => insertAtCursor('\n<h2>', '</h2>\n')
  const handleH3 = () => insertAtCursor('\n<h3>', '</h3>\n')
  const handleList = () => insertAtCursor('\n<ul>\n  <li>', '</li>\n</ul>\n')
  const handleOrderedList = () => insertAtCursor('\n<ol>\n  <li>', '</li>\n</ol>\n')
  const handleCode = () => wrapSelection('<code>', '</code>')
  const handleQuote = () => insertAtCursor('\n<blockquote>', '</blockquote>\n')

  const handleLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      const text = prompt('Enter link text (optional):')
      if (text) {
        wrapSelection(`<a href="${url}">`, '</a>')
      } else {
        insertAtCursor(`<a href="${url}">`, '</a>')
      }
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axiosInstance.post('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.success) {
        const imageUrl = response.data.data.url
        const alt = prompt('Enter image alt text (optional):') || 'Image'
        insertAtCursor(`<img src="${imageUrl}" alt="${alt}" />`)
        toast.success('Image uploaded successfully')
      }
    } catch (error) {
      console.error('Image upload error:', error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const renderPreview = () => {
    return (
      <div
        className="prose dark:prose-invert max-w-none p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md min-h-[200px]"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    )
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {/* Toolbar */}
      <Card className="p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBold}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleItalic}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUnderline}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleH1}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleH2}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleH3}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleList}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleOrderedList}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLink}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            title="Insert Image"
            disabled={uploading}
          >
            {uploading ? (
              <Upload className="h-4 w-4 animate-pulse" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
          </Button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleQuote}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCode}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </Button>

          <div className="ml-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              title={showPreview ? "Hide Preview" : "Show Preview"}
            >
              {showPreview ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Editor or Preview */}
      {showPreview ? (
        renderPreview()
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="font-mono text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
        />
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {showPreview ? 'Preview mode - Toggle to edit' : 'HTML formatting supported'}
      </p>
    </div>
  )
}
