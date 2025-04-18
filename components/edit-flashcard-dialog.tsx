"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Flashcard } from "@/types/flashcard"
import { updateFlashcard } from "@/lib/storage"

interface EditFlashcardDialogProps {
  flashcard: Flashcard | null
  nativeLanguage: string
  targetLanguage: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onFlashcardUpdated: () => void
  isDefinitionMode?: boolean
}

export default function EditFlashcardDialog({
  flashcard,
  nativeLanguage,
  targetLanguage,
  open,
  onOpenChange,
  onFlashcardUpdated,
  isDefinitionMode = false,
}: EditFlashcardDialogProps) {
  const [nativeWord, setNativeWord] = useState("")
  const [targetWord, setTargetWord] = useState("")
  const [nativeExample, setNativeExample] = useState("")
  const [targetExample, setTargetExample] = useState("")

  // Update form when flashcard changes
  useEffect(() => {
    if (flashcard) {
      setNativeWord(flashcard.nativeWord || "")
      setTargetWord(flashcard.targetWord || "")
      setNativeExample(flashcard.nativeExample || "")
      setTargetExample(flashcard.targetExample || "")
    }
  }, [flashcard])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!flashcard || !nativeWord.trim() || !targetWord.trim()) {
      return
    }

    const updatedFlashcard: Flashcard = {
      ...flashcard,
      nativeWord: nativeWord.trim(),
      targetWord: targetWord.trim(),
      nativeExample: nativeExample.trim() || undefined,
      targetExample: targetExample.trim() || undefined,
    }

    updateFlashcard(updatedFlashcard, nativeLanguage, targetLanguage)
    onFlashcardUpdated()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Flashcard</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="native-word">{isDefinitionMode ? "Word" : `${nativeLanguage} Word`}</Label>
            <Input
              id="native-word"
              value={nativeWord}
              onChange={(e) => setNativeWord(e.target.value)}
              placeholder={isDefinitionMode ? "Enter word" : `Enter word in your language`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-word">{isDefinitionMode ? "Definition" : `${targetLanguage} Word`}</Label>
            <Textarea
              id="target-word"
              value={targetWord}
              onChange={(e) => setTargetWord(e.target.value)}
              placeholder={isDefinitionMode ? "Enter definition" : `Enter word in target language`}
              required
              rows={isDefinitionMode ? 3 : 1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="native-example">
              {isDefinitionMode ? "Example Sentence" : `Example in ${nativeLanguage}`} (Optional)
            </Label>
            <Textarea
              id="native-example"
              value={nativeExample}
              onChange={(e) => setNativeExample(e.target.value)}
              placeholder={isDefinitionMode ? "Example sentence using the word" : `Example sentence in your language`}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-example">
              {isDefinitionMode ? "Second Example Sentence" : `Example in ${targetLanguage}`} (Optional)
            </Label>
            <Textarea
              id="target-example"
              value={targetExample}
              onChange={(e) => setTargetExample(e.target.value)}
              placeholder={
                isDefinitionMode ? "Second example sentence using the word" : `Example sentence in target language`
              }
              rows={2}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
