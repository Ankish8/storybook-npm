import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tag } from '../tag'

describe('Tag', () => {
  it('renders children correctly', () => {
    render(<Tag>Test Tag</Tag>)
    expect(screen.getByText('Test Tag')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    render(<Tag data-testid="tag">Default</Tag>)
    const tag = screen.getByTestId('tag')
    expect(tag).toHaveClass('bg-[#F3F4F6]')
    expect(tag).toHaveClass('text-[#333333]')
  })

  it.each([
    ['default', 'bg-[#F3F4F6]', 'text-[#333333]'],
    ['primary', 'bg-[#343E55]/10', 'text-[#343E55]'],
    ['secondary', 'bg-[#E5E7EB]', 'text-[#374151]'],
    ['success', 'bg-[#E5FFF5]', 'text-[#00A651]'],
    ['warning', 'bg-[#FFF8E5]', 'text-[#F59E0B]'],
    ['error', 'bg-[#FFECEC]', 'text-[#FF3B3B]'],
  ] as const)('renders %s variant', (variant, bgClass, textClass) => {
    render(<Tag variant={variant} data-testid="tag">Test</Tag>)
    const tag = screen.getByTestId('tag')
    expect(tag).toHaveClass(bgClass)
    expect(tag).toHaveClass(textClass)
  })

  it.each([
    ['default', 'px-2', 'py-1'],
    ['sm', 'px-1.5', 'py-0.5'],
    ['lg', 'px-3', 'py-1.5'],
  ] as const)('renders %s size', (size, paddingX, paddingY) => {
    render(<Tag size={size} data-testid="tag">Test</Tag>)
    const tag = screen.getByTestId('tag')
    expect(tag).toHaveClass(paddingX)
    expect(tag).toHaveClass(paddingY)
  })

  it('renders sm size with smaller text', () => {
    render(<Tag size="sm" data-testid="tag">Small</Tag>)
    expect(screen.getByTestId('tag')).toHaveClass('text-xs')
  })
})

describe('Tag with label', () => {
  it('renders label prefix', () => {
    render(<Tag label="Event:">Call Started</Tag>)
    expect(screen.getByText('Event:')).toBeInTheDocument()
    expect(screen.getByText('Call Started')).toBeInTheDocument()
  })

  it('renders label with semibold font', () => {
    render(<Tag label="Type:">Value</Tag>)
    const label = screen.getByText('Type:')
    expect(label).toHaveClass('font-semibold')
  })

  it('renders children with normal font', () => {
    render(<Tag label="Label:">Content</Tag>)
    const content = screen.getByText('Content')
    expect(content).toHaveClass('font-normal')
  })
})

describe('Tag interactive state', () => {
  it('is not interactive by default', () => {
    render(<Tag data-testid="tag">Non-interactive</Tag>)
    const tag = screen.getByTestId('tag')
    expect(tag).not.toHaveAttribute('role')
    expect(tag).not.toHaveAttribute('tabIndex')
  })

  it('has button role when interactive', () => {
    render(<Tag interactive data-testid="tag">Interactive</Tag>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('is focusable when interactive', () => {
    render(<Tag interactive data-testid="tag">Interactive</Tag>)
    expect(screen.getByTestId('tag')).toHaveAttribute('tabIndex', '0')
  })

  it('has hover styles when interactive', () => {
    render(<Tag interactive data-testid="tag">Interactive</Tag>)
    const tag = screen.getByTestId('tag')
    expect(tag).toHaveClass('cursor-pointer')
    expect(tag).toHaveClass('hover:bg-[#E5E7EB]')
  })

  it('has active styles when interactive', () => {
    render(<Tag interactive data-testid="tag">Interactive</Tag>)
    expect(screen.getByTestId('tag')).toHaveClass('active:bg-[#D1D5DB]')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Tag interactive onClick={handleClick}>Clickable</Tag>)

    await screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

describe('Tag selected state', () => {
  it('is not selected by default', () => {
    render(<Tag data-testid="tag">Not Selected</Tag>)
    const tag = screen.getByTestId('tag')
    expect(tag).not.toHaveClass('ring-2')
    expect(tag).toHaveAttribute('aria-selected', 'false')
  })

  it('shows ring when selected', () => {
    render(<Tag selected data-testid="tag">Selected</Tag>)
    const tag = screen.getByTestId('tag')
    expect(tag).toHaveClass('ring-2')
    expect(tag).toHaveClass('ring-[#343E55]')
    expect(tag).toHaveClass('ring-offset-1')
  })

  it('has aria-selected true when selected', () => {
    render(<Tag selected data-testid="tag">Selected</Tag>)
    expect(screen.getByTestId('tag')).toHaveAttribute('aria-selected', 'true')
  })

  it('can be both interactive and selected', () => {
    render(<Tag interactive selected data-testid="tag">Interactive Selected</Tag>)
    const tag = screen.getByTestId('tag')
    expect(tag).toHaveClass('cursor-pointer')
    expect(tag).toHaveClass('ring-2')
    expect(tag).toHaveAttribute('role', 'button')
    expect(tag).toHaveAttribute('aria-selected', 'true')
  })
})

describe('Tag custom styling', () => {
  it('applies custom className', () => {
    render(<Tag className="custom-class" data-testid="tag">Custom</Tag>)
    expect(screen.getByTestId('tag')).toHaveClass('custom-class')
  })

  it('preserves base classes with custom className', () => {
    render(<Tag className="custom-class" data-testid="tag">Custom</Tag>)
    const tag = screen.getByTestId('tag')
    expect(tag).toHaveClass('inline-flex')
    expect(tag).toHaveClass('custom-class')
  })
})

describe('Tag ref forwarding', () => {
  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Tag ref={ref}>Test</Tag>)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })
})

describe('Tag accessibility', () => {
  it('renders as span by default', () => {
    render(<Tag data-testid="tag">Span Tag</Tag>)
    expect(screen.getByTestId('tag').tagName).toBe('SPAN')
  })

  it('supports aria attributes', () => {
    render(<Tag aria-label="Custom label" data-testid="tag">Tag</Tag>)
    expect(screen.getByTestId('tag')).toHaveAttribute('aria-label', 'Custom label')
  })
})
