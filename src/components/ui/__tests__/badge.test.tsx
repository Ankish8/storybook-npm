import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../badge'

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    const { container } = render(<Badge>Default</Badge>)
    expect(container.firstChild).toHaveClass('bg-[#F3F5F6]')
    expect(container.firstChild).toHaveClass('text-[#333333]')
  })

  it.each([
    ['active', 'bg-[#E5FFF5]', 'text-[#00A651]'],
    ['failed', 'bg-[#FFECEC]', 'text-[#FF3B3B]'],
    ['disabled', 'bg-[#F3F5F6]', 'text-[#6B7280]'],
    ['default', 'bg-[#F3F5F6]', 'text-[#333333]'],
  ] as const)('renders %s variant with correct classes', (variant, bgClass, textClass) => {
    const { container } = render(<Badge variant={variant}>Test</Badge>)
    expect(container.firstChild).toHaveClass(bgClass)
    expect(container.firstChild).toHaveClass(textClass)
  })

  it.each([
    ['default', 'px-3', 'py-1'],
    ['sm', 'px-2', 'py-0.5'],
    ['lg', 'px-4', 'py-1.5'],
  ] as const)('renders %s size with correct classes', (size, pxClass, pyClass) => {
    const { container } = render(<Badge size={size}>Test</Badge>)
    expect(container.firstChild).toHaveClass(pxClass)
    expect(container.firstChild).toHaveClass(pyClass)
  })

  it('renders with left icon', () => {
    render(
      <Badge leftIcon={<span data-testid="left-icon">Icon</span>}>
        With Icon
      </Badge>
    )
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByText('With Icon')).toBeInTheDocument()
  })

  it('renders with right icon', () => {
    render(
      <Badge rightIcon={<span data-testid="right-icon">Icon</span>}>
        With Icon
      </Badge>
    )
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('renders with both icons', () => {
    render(
      <Badge
        leftIcon={<span data-testid="left">L</span>}
        rightIcon={<span data-testid="right">R</span>}
      >
        Both
      </Badge>
    )
    expect(screen.getByTestId('left')).toBeInTheDocument()
    expect(screen.getByTestId('right')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-class">Test</Badge>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Badge ref={ref}>Test</Badge>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('passes through additional props', () => {
    render(<Badge data-testid="custom-badge" aria-label="Status">Test</Badge>)
    const badge = screen.getByTestId('custom-badge')
    expect(badge).toHaveAttribute('aria-label', 'Status')
  })
})
