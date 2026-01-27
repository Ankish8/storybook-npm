import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AlertConfiguration } from "./alert-configuration";
import { AlertValuesModal } from "./alert-values-modal";

const meta: Meta<typeof AlertConfiguration> = {
  title: "Custom/AlertConfiguration",
  component: AlertConfiguration,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
AlertConfiguration displays current alert thresholds for minimum balance and top-up values. Used in payment auto-pay setup to show notification settings.

## Installation

This is a custom component (not available via CLI). Import directly from the package:

\`\`\`bash
npm install myoperator-ui
\`\`\`

## Import

\`\`\`tsx
import { AlertConfiguration, AlertValuesModal } from "myoperator-ui"
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Usage</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Container border, dividers</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E4E4E4; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Background Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px;">Container background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Title, labels, values</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #333333; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Helper text, descriptions</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Error Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-error-primary</code></td>
      <td style="padding: 12px 16px;">Negative balance (red)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F04438; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Link</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-link</code></td>
      <td style="padding: 12px 16px;">Top-up amount (blue)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>

## Typography

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Element</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Style</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Size / Weight</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Class</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Title</td>
      <td style="padding: 12px 16px;">Title/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">16px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-base font-semibold</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Description</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Labels</td>
      <td style="padding: 12px 16px;">Label/Large</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / SemiBold</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm font-semibold</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Values</td>
      <td style="padding: 12px 16px;">Body/Medium</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Helper Text</td>
      <td style="padding: 12px 16px;">Body/Small</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Regular</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm leading-relaxed</code></td>
    </tr>
  </tbody>
</table>

## Usage

\`\`\`tsx
import { useState } from "react"
import { AlertConfiguration, AlertValuesModal } from "myoperator-ui"

function PaymentPage() {
  const [balance, setBalance] = useState(250)
  const [topup, setTopup] = useState(500)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSave = (values) => {
    setBalance(values.minimumBalance)
    setTopup(values.minimumTopup)
    setModalOpen(false)
  }

  return (
    <>
      <AlertConfiguration
        minimumBalance={balance}
        minimumTopup={topup}
        onEdit={() => setModalOpen(true)}
      />

      <AlertValuesModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialMinimumBalance={balance}
        initialMinimumTopup={topup}
        onSave={handleSave}
      />
    </>
  )
}
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    minimumBalance: {
      control: "number",
      description: "Minimum balance threshold",
    },
    minimumTopup: {
      control: "number",
      description: "Minimum top-up amount",
    },
    currencySymbol: {
      control: "text",
      description: "Currency symbol to display",
    },
    onEdit: {
      action: "edit clicked",
      description: "Callback when edit button is clicked",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AlertConfiguration>;

/**
 * Default alert configuration with positive balance.
 * Click "Edit alert values" to open the modal.
 */
export const Default: Story = {
  render: () => {
    const [minimumBalance, setMinimumBalance] = useState(250.0);
    const [minimumTopup, setMinimumTopup] = useState(500.0);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = (values: {
      minimumBalance: number;
      minimumTopup: number;
    }) => {
      setLoading(true);
      setTimeout(() => {
        setMinimumBalance(values.minimumBalance);
        setMinimumTopup(values.minimumTopup);
        setLoading(false);
        setModalOpen(false);
      }, 1000);
    };

    return (
      <>
        <AlertConfiguration
          minimumBalance={minimumBalance}
          minimumTopup={minimumTopup}
          onEdit={() => setModalOpen(true)}
        />
        <AlertValuesModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          initialMinimumBalance={minimumBalance}
          initialMinimumTopup={minimumTopup}
          onSave={handleSave}
          loading={loading}
        />
      </>
    );
  },
};

/**
 * Alert configuration with negative balance (shown in red).
 * Click "Edit alert values" to open the modal.
 */
export const NegativeBalance: Story = {
  render: () => {
    const [minimumBalance, setMinimumBalance] = useState(-250.0);
    const [minimumTopup, setMinimumTopup] = useState(500.0);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = (values: {
      minimumBalance: number;
      minimumTopup: number;
    }) => {
      setLoading(true);
      setTimeout(() => {
        setMinimumBalance(values.minimumBalance);
        setMinimumTopup(values.minimumTopup);
        setLoading(false);
        setModalOpen(false);
      }, 1000);
    };

    return (
      <>
        <AlertConfiguration
          minimumBalance={minimumBalance}
          minimumTopup={minimumTopup}
          onEdit={() => setModalOpen(true)}
        />
        <AlertValuesModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          initialMinimumBalance={minimumBalance}
          initialMinimumTopup={minimumTopup}
          onSave={handleSave}
          loading={loading}
        />
      </>
    );
  },
};

/**
 * Alert configuration with large amounts.
 */
export const LargeAmounts: Story = {
  args: {
    minimumBalance: 10000.0,
    minimumTopup: 25000.0,
    currencySymbol: "₹",
  },
};

/**
 * Alert configuration with USD currency.
 */
export const USDCurrency: Story = {
  args: {
    minimumBalance: 100.0,
    minimumTopup: 200.0,
    currencySymbol: "$",
  },
};

/**
 * Alert configuration with zero values.
 */
export const ZeroValues: Story = {
  args: {
    minimumBalance: 0,
    minimumTopup: 0,
    currencySymbol: "₹",
  },
};

/**
 * Interactive example with modal functionality.
 * Click "Edit alert values" to open the modal and update values.
 */
export const WithModal: Story = {
  render: () => {
    const [minimumBalance, setMinimumBalance] = useState(250.0);
    const [minimumTopup, setMinimumTopup] = useState(500.0);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = (values: {
      minimumBalance: number;
      minimumTopup: number;
    }) => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setMinimumBalance(values.minimumBalance);
        setMinimumTopup(values.minimumTopup);
        setLoading(false);
        setModalOpen(false);
      }, 1000);
    };

    return (
      <>
        <AlertConfiguration
          minimumBalance={minimumBalance}
          minimumTopup={minimumTopup}
          onEdit={() => setModalOpen(true)}
        />
        <AlertValuesModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          initialMinimumBalance={minimumBalance}
          initialMinimumTopup={minimumTopup}
          onSave={handleSave}
          loading={loading}
        />
      </>
    );
  },
};

/**
 * Modal component shown in isolation.
 * Click "Open Modal" button to test the modal.
 */
export const ModalOnly: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = (values: {
      minimumBalance: number;
      minimumTopup: number;
    }) => {
      setLoading(true);
      console.log("Saved values:", values);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 1000);
    };

    return (
      <div className="p-8">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-semantic-primary text-white rounded"
        >
          Open Modal
        </button>
        <AlertValuesModal
          open={open}
          onOpenChange={setOpen}
          initialMinimumBalance={250}
          initialMinimumTopup={500}
          onSave={handleSave}
          loading={loading}
        />
      </div>
    );
  },
};

/**
 * Full payment page context showing how the component fits in.
 */
export const PaymentPageContext: Story = {
  render: () => {
    const [minimumBalance, setMinimumBalance] = useState(-250.0);
    const [minimumTopup, setMinimumTopup] = useState(500.0);
    const [modalOpen, setModalOpen] = useState(false);

    const handleSave = (values: {
      minimumBalance: number;
      minimumTopup: number;
    }) => {
      setMinimumBalance(values.minimumBalance);
      setMinimumTopup(values.minimumTopup);
      setModalOpen(false);
    };

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-semantic-text-primary mb-2">
            Payment Auto-pay setup
          </h1>
          <p className="text-sm text-semantic-text-muted">
            Configure automatic payment settings
          </p>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-semantic-bg-primary border border-semantic-border-primary rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-semantic-text-primary">
            Payment
          </h2>
          <p className="text-sm text-semantic-text-muted">
            Detailed breakdown of current cycle charges
          </p>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-semantic-text-secondary">
                Business Account Number (BAN)
              </span>
              <span className="font-medium text-semantic-text-primary">
                6LMWPG
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-semantic-text-secondary">
                Total amount due
              </span>
              <span className="font-semibold text-semantic-error-primary">
                -₹78,518.94
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-semantic-text-secondary">Credit limit</span>
              <span className="font-medium text-semantic-text-primary">
                ₹ 10,000.00
              </span>
            </div>
          </div>
        </div>

        {/* Alert Configuration */}
        <AlertConfiguration
          minimumBalance={minimumBalance}
          minimumTopup={minimumTopup}
          onEdit={() => setModalOpen(true)}
        />

        <AlertValuesModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          initialMinimumBalance={minimumBalance}
          initialMinimumTopup={minimumTopup}
          onSave={handleSave}
        />
      </div>
    );
  },
};
