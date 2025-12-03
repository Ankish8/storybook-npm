import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('applies default variant classes', () => {
    render(<Button>Default</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-[#343E55]')
    expect(button).toHaveClass('text-white')
  })

  it.each([
    ['default', 'bg-[#343E55]'],
    ['destructive', 'bg-destructive'],
    ['outline', 'border-[#343E55]'],
    ['secondary', 'bg-[#343E55]/20'],
    ['ghost', 'hover:bg-[#F3F4F6]'],
    ['link', 'underline-offset-4'],
  ] as const)('renders %s variant', (variant, expectedClass) => {
    render(<Button variant={variant}>Test</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass(expectedClass)
  })

  it.each([
    ['default', 'py-2.5', 'px-4'],
    ['sm', 'py-2', 'px-3'],
    ['lg', 'py-3', 'px-6'],
    ['icon', 'h-8', 'w-8'],
  ] as const)('renders %s size', (size, ...expectedClasses) => {
    render(<Button size={size}>Test</Button>)
    const button = screen.getByRole('button')
    expectedClasses.forEach(cls => {
      if (cls) expect(button).toHaveClass(cls)
    })
  })

  it('renders with left icon', () => {
    render(
      <Button leftIcon={<span data-testid="left-icon">←</span>}>
        With Icon
      </Button>
    )
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByText('With Icon')).toBeInTheDocument()
  })

  it('renders with right icon', () => {
    render(
      <Button rightIcon={<span data-testid="right-icon">→</span>}>
        With Icon
      </Button>
    )
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Loading')
  })

  it('shows loading text when provided', () => {
    render(<Button loading loadingText="Please wait...">Submit</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Please wait...')
  })

  it('is disabled when loading', () => {
    render(<Button loading>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Button ref={ref}>Test</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('renders as child component with asChild', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    const link = screen.getByRole('link')
    expect(link).toHaveTextContent('Link Button')
    expect(link).toHaveAttribute('href', '/test')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    await screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not trigger click when disabled', async () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Click</Button>)

    await screen.getByRole('button').click()
    expect(handleClick).not.toHaveBeenCalled()
  })
})
