"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Copy, Check } from "lucide-react" // Added Copy and Check icons
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react" // Added useState

// Helper component for tips
const Tip = ({ tip }: { tip: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{tip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

interface JsonOutputProps {
  generatedJson: string
}

export default function JsonOutput({ generatedJson }: JsonOutputProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false) // State to manage copy feedback

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedJson)
    setCopied(true) // Set copied state to true
    toast({
      title: "JSON Copied!",
      description: "The generated JSON has been copied to your clipboard.",
    })

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Generated JSON Output
          <Tip tip="This is the live JSON output based on your inputs. Copy it when you're done!" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <pre className="bg-muted p-4 rounded-md text-sm overflow-auto h-full">
          <code>{generatedJson}</code>
        </pre>
      </CardContent>
      <div className="p-4 border-t">
        <Button onClick={handleCopy} className="w-full">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" /> Copy JSON
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
