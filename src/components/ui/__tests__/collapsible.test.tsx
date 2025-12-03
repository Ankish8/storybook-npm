import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Collapsible,
  CollapsibleItem,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../collapsible'

const TestCollapsible = ({
  type = 'multiple' as const,
  defaultValue = [] as string[],
  value,
  onValueChange,
  variant = 'default' as const,
}: {
  type?: 'single' | 'multiple'
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  variant?: 'default' | 'bordered'
}) => (
  <Collapsible
    type={type}
    defaultValue={defaultValue}
    value={value}
    onValueChange={onValueChange}
    variant={variant}
  >
    <CollapsibleItem value="item-1">
      <CollapsibleTrigger>Trigger 1</CollapsibleTrigger>
      <CollapsibleContent>Content 1</CollapsibleContent>
    </CollapsibleItem>
    <CollapsibleItem value="item-2">
      <CollapsibleTrigger>Trigger 2</CollapsibleTrigger>
      <CollapsibleContent>Content 2</CollapsibleContent>
    </CollapsibleItem>
    <CollapsibleItem value="item-3">
      <CollapsibleTrigger>Trigger 3</CollapsibleTrigger>
      <CollapsibleContent>Content 3</CollapsibleContent>
    </CollapsibleItem>
  </Collapsible>
)

describe('Collapsible', () => {
  it('renders correctly', () => {
    render(<TestCollapsible />)
    expect(screen.getByText('Trigger 1')).toBeInTheDocument()
    expect(screen.getByText('Trigger 2')).toBeInTheDocument()
    expect(screen.getByText('Trigger 3')).toBeInTheDocument()
  })

  it('renders with role="button" for triggers', () => {
    render(<TestCollapsible />)
    const triggers = screen.getAllByRole('button')
    expect(triggers).toHaveLength(3)
  })

  it('all items are closed by default', () => {
    render(<TestCollapsible />)
    const triggers = screen.getAllByRole('button')
    triggers.forEach((trigger) => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('respects defaultValue prop', () => {
    render(<TestCollapsible defaultValue={['item-1', 'item-2']} />)
    const triggers = screen.getAllByRole('button')
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'true')
    expect(triggers[2]).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens item when trigger is clicked in multiple mode', () => {
    render(<TestCollapsible type="multiple" />)
    const triggers = screen.getAllByRole('button')

    fireEvent.click(triggers[0])
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(triggers[1])
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes item when clicked again in multiple mode', () => {
    render(<TestCollapsible type="multiple" defaultValue={['item-1']} />)
    const triggers = screen.getAllByRole('button')

    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(triggers[0])
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'false')
  })

  it('only one item can be open in single mode', () => {
    render(<TestCollapsible type="single" defaultValue={['item-1']} />)
    const triggers = screen.getAllByRole('button')

    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(triggers[1])
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'false')
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'true')
  })

  it('can close all items in single mode', () => {
    render(<TestCollapsible type="single" defaultValue={['item-1']} />)
    const triggers = screen.getAllByRole('button')

    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(triggers[0])
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'false')
  })

  it('calls onValueChange when item is toggled', () => {
    const handleChange = vi.fn()
    render(<TestCollapsible onValueChange={handleChange} />)
    const triggers = screen.getAllByRole('button')

    fireEvent.click(triggers[0])
    expect(handleChange).toHaveBeenCalledWith(['item-1'])
  })

  it('works in controlled mode', () => {
    const handleChange = vi.fn()
    const { rerender } = render(
      <TestCollapsible value={['item-1']} onValueChange={handleChange} />
    )

    const triggers = screen.getAllByRole('button')
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(triggers[1])
    expect(handleChange).toHaveBeenCalledWith(['item-1', 'item-2'])

    // Simulate parent updating value
    rerender(<TestCollapsible value={['item-1', 'item-2']} onValueChange={handleChange} />)
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'true')
  })

  it('applies custom className to root', () => {
    render(
      <Collapsible className="custom-class" data-testid="collapsible">
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger>Trigger</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    )
    expect(screen.getByTestId('collapsible')).toHaveClass('custom-class')
  })

  it('applies bordered variant classes', () => {
    render(
      <Collapsible variant="bordered" data-testid="collapsible">
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger>Trigger</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    )
    expect(screen.getByTestId('collapsible')).toHaveClass('border')
    expect(screen.getByTestId('collapsible')).toHaveClass('rounded-lg')
  })

  it('sets data-state attribute on items', () => {
    render(
      <Collapsible defaultValue={['item-1']}>
        <CollapsibleItem value="item-1" data-testid="item-1">
          <CollapsibleTrigger>Trigger 1</CollapsibleTrigger>
          <CollapsibleContent>Content 1</CollapsibleContent>
        </CollapsibleItem>
        <CollapsibleItem value="item-2" data-testid="item-2">
          <CollapsibleTrigger>Trigger 2</CollapsibleTrigger>
          <CollapsibleContent>Content 2</CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    )
    expect(screen.getByTestId('item-1')).toHaveAttribute('data-state', 'open')
    expect(screen.getByTestId('item-2')).toHaveAttribute('data-state', 'closed')
  })

  it('hides chevron when showChevron is false', () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger showChevron={false}>Trigger</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    )
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('shows chevron by default', () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger>Trigger</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('forwards ref correctly for Collapsible', () => {
    const ref = { current: null }
    render(
      <Collapsible ref={ref}>
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger>Trigger</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('forwards ref correctly for CollapsibleItem', () => {
    const ref = { current: null }
    render(
      <Collapsible>
        <CollapsibleItem value="item-1" ref={ref}>
          <CollapsibleTrigger>Trigger</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('forwards ref correctly for CollapsibleTrigger', () => {
    const ref = { current: null }
    render(
      <Collapsible>
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger ref={ref}>Trigger</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('forwards ref correctly for CollapsibleContent', () => {
    const ref = { current: null }
    render(
      <Collapsible defaultValue={['item-1']}>
        <CollapsibleItem value="item-1">
          <CollapsibleTrigger>Trigger</CollapsibleTrigger>
          <CollapsibleContent ref={ref}>Content</CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('CollapsibleItem disabled', () => {
  it('does not toggle when item is disabled', () => {
    const handleChange = vi.fn()
    render(
      <Collapsible onValueChange={handleChange}>
        <CollapsibleItem value="item-1" disabled>
          <CollapsibleTrigger>Disabled Trigger</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    )

    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('applies disabled attribute to trigger', () => {
    render(
      <Collapsible>
        <CollapsibleItem value="item-1" disabled>
          <CollapsibleTrigger>Disabled Trigger</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </CollapsibleItem>
      </Collapsible>
    )

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
