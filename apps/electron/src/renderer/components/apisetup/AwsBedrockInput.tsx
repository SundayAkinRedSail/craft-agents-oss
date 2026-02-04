/**
 * AwsBedrockInput - AWS Bedrock credentials entry form
 *
 * Renders inputs for AWS Access Key, Secret Key, and Region selection
 * for connecting to Claude via AWS Bedrock.
 *
 * Does NOT include layout wrappers or action buttons — the parent
 * controls placement via the form ID ("aws-bedrock-form") for submit binding.
 */

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  StyledDropdownMenuContent,
  StyledDropdownMenuItem,
} from "@/components/ui/styled-dropdown"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, Eye, EyeOff } from "lucide-react"

export type AwsBedrockStatus = 'idle' | 'validating' | 'success' | 'error'

export interface AwsBedrockSubmitData {
  accessKeyId: string
  secretAccessKey: string
  region: string
  sessionToken?: string
}

export interface AwsBedrockInputProps {
  /** Current validation status */
  status: AwsBedrockStatus
  /** Error message to display when status is 'error' */
  errorMessage?: string
  /** Called when the form is submitted */
  onSubmit: (data: AwsBedrockSubmitData) => void
  /** Form ID for external submit button binding (default: "aws-bedrock-form") */
  formId?: string
  /** Disable the input (e.g. during validation) */
  disabled?: boolean
}

interface AwsRegion {
  id: string
  name: string
}

const AWS_REGIONS: AwsRegion[] = [
  { id: 'us-east-1', name: 'US East (N. Virginia)' },
  { id: 'us-west-2', name: 'US West (Oregon)' },
  { id: 'eu-west-1', name: 'Europe (Ireland)' },
  { id: 'eu-central-1', name: 'Europe (Frankfurt)' },
  { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
  { id: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' },
]

export function AwsBedrockInput({
  status,
  errorMessage,
  onSubmit,
  formId = "aws-bedrock-form",
  disabled,
}: AwsBedrockInputProps) {
  const [accessKeyId, setAccessKeyId] = useState('')
  const [secretAccessKey, setSecretAccessKey] = useState('')
  const [sessionToken, setSessionToken] = useState('')
  const [region, setRegion] = useState('us-east-1')
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [showSessionToken, setShowSessionToken] = useState(false)

  const isDisabled = disabled || status === 'validating'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      accessKeyId: accessKeyId.trim(),
      secretAccessKey: secretAccessKey.trim(),
      region,
      sessionToken: sessionToken.trim() || undefined,
    })
  }

  const selectedRegion = AWS_REGIONS.find(r => r.id === region) || AWS_REGIONS[0]

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6">
      {/* AWS Access Key ID */}
      <div className="space-y-2">
        <Label htmlFor="aws-access-key">AWS Access Key ID</Label>
        <div className={cn(
          "relative rounded-md shadow-minimal transition-colors",
          "bg-foreground-2 focus-within:bg-background"
        )}>
          <Input
            id="aws-access-key"
            type="text"
            value={accessKeyId}
            onChange={(e) => setAccessKeyId(e.target.value)}
            placeholder="AKIA..."
            className={cn(
              "border-0 bg-transparent shadow-none",
              status === 'error' && "focus-visible:ring-destructive"
            )}
            disabled={isDisabled}
            autoFocus
          />
        </div>
      </div>

      {/* AWS Secret Access Key */}
      <div className="space-y-2">
        <Label htmlFor="aws-secret-key">AWS Secret Access Key</Label>
        <div className={cn(
          "relative rounded-md shadow-minimal transition-colors",
          "bg-foreground-2 focus-within:bg-background"
        )}>
          <Input
            id="aws-secret-key"
            type={showSecretKey ? 'text' : 'password'}
            value={secretAccessKey}
            onChange={(e) => setSecretAccessKey(e.target.value)}
            placeholder="Your secret access key"
            className={cn(
              "pr-10 border-0 bg-transparent shadow-none",
              status === 'error' && "focus-visible:ring-destructive"
            )}
            disabled={isDisabled}
          />
          <button
            type="button"
            onClick={() => setShowSecretKey(!showSecretKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showSecretKey ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* AWS Region */}
      <div className="space-y-2">
        <Label htmlFor="aws-region">AWS Region</Label>
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={isDisabled}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md px-3 text-sm",
              "bg-foreground-2 shadow-minimal transition-colors",
              "hover:bg-background focus:outline-none focus:bg-background"
            )}
          >
            <span>{selectedRegion.name}</span>
            <ChevronDown className="size-4 opacity-50" />
          </DropdownMenuTrigger>
          <StyledDropdownMenuContent align="start" className="z-floating-menu w-[var(--radix-dropdown-menu-trigger-width)]">
            {AWS_REGIONS.map((r) => (
              <StyledDropdownMenuItem
                key={r.id}
                onClick={() => setRegion(r.id)}
                className="justify-between"
              >
                <span>{r.name}</span>
                <Check className={cn("size-3", region === r.id ? "opacity-100" : "opacity-0")} />
              </StyledDropdownMenuItem>
            ))}
          </StyledDropdownMenuContent>
        </DropdownMenu>
        <p className="text-xs text-foreground/30">
          Region ID: <code className="text-foreground/40">{region}</code>
        </p>
      </div>

      {/* AWS Session Token (optional) */}
      <div className="space-y-2">
        <Label htmlFor="aws-session-token" className="text-muted-foreground font-normal">
          Session Token <span className="text-foreground/30">· optional</span>
        </Label>
        <div className={cn(
          "relative rounded-md shadow-minimal transition-colors",
          "bg-foreground-2 focus-within:bg-background"
        )}>
          <Input
            id="aws-session-token"
            type={showSessionToken ? 'text' : 'password'}
            value={sessionToken}
            onChange={(e) => setSessionToken(e.target.value)}
            placeholder="For temporary credentials only"
            className="pr-10 border-0 bg-transparent shadow-none"
            disabled={isDisabled}
          />
          <button
            type="button"
            onClick={() => setShowSessionToken(!showSessionToken)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showSessionToken ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-foreground/30">
          Only required if using temporary AWS credentials (e.g., from AWS STS)
        </p>
      </div>

      {/* Error message */}
      {status === 'error' && errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      {/* Info about model IDs */}
      <div className="rounded-md bg-foreground/5 p-3 text-xs text-foreground/50">
        <p className="font-medium text-foreground/70 mb-1">AWS Bedrock Model IDs</p>
        <p>Claude models on Bedrock use these IDs:</p>
        <ul className="mt-1 space-y-0.5 font-mono text-[11px]">
          <li>• Opus 4.5: <code className="text-foreground/60">us.anthropic.claude-opus-4-5-20251101-v1:0</code></li>
          <li>• Sonnet 4.5: <code className="text-foreground/60">us.anthropic.claude-sonnet-4-5-20250929-v1:0</code></li>
          <li>• Haiku 4.5: <code className="text-foreground/60">us.anthropic.claude-haiku-4-5-20251001-v1:0</code></li>
        </ul>
      </div>
    </form>
  )
}
