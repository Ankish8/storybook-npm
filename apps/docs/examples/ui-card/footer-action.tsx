import { useState } from "react";
import {
  UiCard,
  UiCardHeader,
  UiCardTitle,
  UiCardDescription,
  UiCardFooter,
} from "@/components/ui/v2/ui-card";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <UiCard>
      <UiCardHeader>
        <UiCardTitle>Weekly report</UiCardTitle>
      </UiCardHeader>
      <UiCardDescription>
        Receive an inbox summary every Monday.
      </UiCardDescription>
      <UiCardFooter>
        <span className="text-xs text-v2-semantic-text-muted">Team report</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSubscribed(!subscribed)}
        >
          {subscribed ? "Unsubscribe" : "Subscribe"}
        </Button>
      </UiCardFooter>
      <p role="status" className="m-0 mt-3 text-xs text-v2-semantic-text-muted">
        {subscribed ? "Subscribed locally" : "No subscription"}
      </p>
    </UiCard>
  );
}
