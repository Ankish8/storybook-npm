import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { useChatContext } from "../chat-provider"

function ResolveButton() {
  const { resolveChat } = useChatContext()
  const [resolved, setResolved] = useState(false)

  const handleClick = () => {
    setResolved((prev) => !prev)
    resolveChat()
  }

  return (
    <Button
      variant={resolved ? "success" : "default"}
      leftIcon={
        <Check
          className={cn(
            "size-[18px] transition-transform duration-200",
            resolved && "scale-110"
          )}
        />
      }
      onClick={handleClick}
      className="transition-all duration-200"
    >
      {resolved ? "Resolved" : "Resolve"}
    </Button>
  )
}
ResolveButton.displayName = "ResolveButton"

export { ResolveButton }
