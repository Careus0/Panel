"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Bot, Shield, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProxySettings {
  enabled: boolean
  type: string
  host: string
  port: number
  username?: string
  password?: string
}

interface PromotionSettings {
  message_template: string
  target_groups: string[]
  interval: number
  enabled: boolean
}

export function AddUserbotDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Basic Info, 2: Verification, 3: Settings
  const [verificationData, setVerificationData] = useState<any>(null)
  const { toast } = useToast()

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    api_id: "",
    api_hash: "",
    verification_code: "",
    password: "",
  })

  const [proxySettings, setProxySettings] = useState<ProxySettings>({
    enabled: false,
    type: "socks5",
    host: "",
    port: 1080,
    username: "",
    password: "",
  })

  const [promotionSettings, setPromotionSettings] = useState<PromotionSettings>({
    message_template: "",
    target_groups: [],
    interval: 3600,
    enabled: false,
  })

  const handleCreateBot = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/v1/bots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.phone_number,
          api_id: formData.api_id,
          api_hash: formData.api_hash,
          proxy_settings: proxySettings.enabled ? proxySettings : null,
          promotion_settings: promotionSettings.enabled ? promotionSettings : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.status === "code_sent") {
          setVerificationData(data)
          setStep(2)
          toast({
            title: "Verification Code Sent",
            description: "Please check your phone for the verification code.",
          })
        } else {
          setStep(3)
          toast({
            title: "Bot Created",
            description: "Your userbot has been created successfully!",
          })
        }
      } else {
        throw new Error(data.detail || "Failed to create bot")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create bot",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/bots/${verificationData.bot_id}/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          phone_code: formData.verification_code,
          phone_code_hash: verificationData.phone_code_hash,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.status === "password_required") {
          toast({
            title: "2FA Required",
            description: "Please enter your two-factor authentication password.",
          })
        } else if (data.status === "success") {
          setStep(3)
          toast({
            title: "Bot Verified",
            description: "Your userbot has been verified successfully!",
          })
        }
      } else {
        throw new Error(data.detail || "Failed to verify code")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify code",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPassword = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/bots/${verificationData.bot_id}/verify-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.status === "success") {
        setStep(3)
        toast({
          title: "Bot Verified",
          description: "Your userbot has been verified successfully!",
        })
      } else {
        throw new Error(data.detail || "Failed to verify password")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify password",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setFormData({
      name: "",
      phone_number: "",
      api_id: "",
      api_hash: "",
      verification_code: "",
      password: "",
    })
    setProxySettings({
      enabled: false,
      type: "socks5",
      host: "",
      port: 1080,
      username: "",
      password: "",
    })
    setPromotionSettings({
      message_template: "",
      target_groups: [],
      interval: 3600,
      enabled: false,
    })
    setVerificationData(null)
  }

  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add New Userbot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Add New Userbot
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter your Telegram account details and configure settings"}
            {step === 2 && "Verify your phone number or enter 2FA password"}
            {step === 3 && "Your userbot has been created successfully!"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Bot Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Userbot"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="+1234567890"
                  />
                </div>
                <div>
                  <Label htmlFor="api_id">API ID</Label>
                  <Input
                    id="api_id"
                    value={formData.api_id}
                    onChange={(e) => setFormData({ ...formData, api_id: e.target.value })}
                    placeholder="Get from my.telegram.org"
                  />
                </div>
                <div>
                  <Label htmlFor="api_hash">API Hash</Label>
                  <Input
                    id="api_hash"
                    value={formData.api_hash}
                    onChange={(e) => setFormData({ ...formData, api_hash: e.target.value })}
                    placeholder="Get from my.telegram.org"
                  />
                </div>
              </div>
            </div>

            {/* Proxy Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <h3 className="text-lg font-medium">Proxy Settings</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={proxySettings.enabled}
                  onCheckedChange={(checked) =>
                    setProxySettings({ ...proxySettings, enabled: checked })
                  }
                />
                <Label>Enable Proxy</Label>
              </div>
              {proxySettings.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="proxy_type">Proxy Type</Label>
                    <Select
                      value={proxySettings.type}
                      onValueChange={(value) =>
                        setProxySettings({ ...proxySettings, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="socks5">SOCKS5</SelectItem>
                        <SelectItem value="socks4">SOCKS4</SelectItem>
                        <SelectItem value="http">HTTP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="proxy_host">Host</Label>
                    <Input
                      id="proxy_host"
                      value={proxySettings.host}
                      onChange={(e) =>
                        setProxySettings({ ...proxySettings, host: e.target.value })
                      }
                      placeholder="127.0.0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="proxy_port">Port</Label>
                    <Input
                      id="proxy_port"
                      type="number"
                      value={proxySettings.port}
                      onChange={(e) =>
                        setProxySettings({ ...proxySettings, port: parseInt(e.target.value) })
                      }
                      placeholder="1080"
                    />
                  </div>
                  <div>
                    <Label htmlFor="proxy_username">Username (Optional)</Label>
                    <Input
                      id="proxy_username"
                      value={proxySettings.username}
                      onChange={(e) =>
                        setProxySettings({ ...proxySettings, username: e.target.value })
                      }
                      placeholder="Username"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="proxy_password">Password (Optional)</Label>
                    <Input
                      id="proxy_password"
                      type="password"
                      value={proxySettings.password}
                      onChange={(e) =>
                        setProxySettings({ ...proxySettings, password: e.target.value })
                      }
                      placeholder="Password"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Promotion Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <h3 className="text-lg font-medium">Promotion Settings</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={promotionSettings.enabled}
                  onCheckedChange={(checked) =>
                    setPromotionSettings({ ...promotionSettings, enabled: checked })
                  }
                />
                <Label>Enable Auto Promotion</Label>
              </div>
              {promotionSettings.enabled && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="message_template">Message Template</Label>
                    <Textarea
                      id="message_template"
                      value={promotionSettings.message_template}
                      onChange={(e) =>
                        setPromotionSettings({
                          ...promotionSettings,
                          message_template: e.target.value,
                        })
                      }
                      placeholder="Enter your promotion message..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="target_groups">Target Groups (one per line)</Label>
                    <Textarea
                      id="target_groups"
                      value={promotionSettings.target_groups.join("\n")}
                      onChange={(e) =>
                        setPromotionSettings({
                          ...promotionSettings,
                          target_groups: e.target.value.split("\n").filter(Boolean),
                        })
                      }
                      placeholder="@group1&#10;@group2&#10;group_id"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="interval">Interval (seconds)</Label>
                    <Input
                      id="interval"
                      type="number"
                      value={promotionSettings.interval}
                      onChange={(e) =>
                        setPromotionSettings({
                          ...promotionSettings,
                          interval: parseInt(e.target.value),
                        })
                      }
                      placeholder="3600"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="verification_code">Verification Code</Label>
              <Input
                id="verification_code"
                value={formData.verification_code}
                onChange={(e) => setFormData({ ...formData, verification_code: e.target.value })}
                placeholder="Enter the code sent to your phone"
              />
            </div>
            <div>
              <Label htmlFor="password">2FA Password (if required)</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your 2FA password"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="text-green-600">
              <Bot className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Userbot Created Successfully!</h3>
              <p className="text-sm text-muted-foreground">
                Your userbot is now ready to use. You can start it from the dashboard.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleCreateBot} disabled={loading}>
                {loading ? "Creating..." : "Create Bot"}
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleVerifyCode} disabled={loading}>
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
              {formData.password && (
                <Button onClick={handleVerifyPassword} disabled={loading}>
                  {loading ? "Verifying..." : "Verify Password"}
                </Button>
              )}
            </>
          )}
          {step === 3 && (
            <Button onClick={handleClose}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
