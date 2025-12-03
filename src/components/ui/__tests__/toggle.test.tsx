import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Toggle } from '../toggle'

describe('Toggle', () => {
  it('renders correctly', () => {
    render(<Toggle data-testid="toggle" />)
    expect(screen.getByTestId('toggle')).toBeInTheDocument()
  })

  it('renders with role="switch"', () => {
    render(<Toggle />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('renders unchecked by default', () => {
    render(<Toggle />)
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    expect(toggle).toHaveClass('bg-[#E5E7EB]')
  })

  it('renders checked state correctly', () => {
    render(<Toggle checked />)
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    expect(toggle).toHaveClass('bg-[#343E55]')
  })

  it.each([
    ['default', 'h-6', 'w-11'],
    ['sm', 'h-5', 'w-9'],
    ['lg', 'h-7', 'w-14'],
  ] as const)('renders %s size', (size, heightClass, widthClass) => {
    render(<Toggle size={size} data-testid="toggle" />)
    const element = screen.getByTestId('toggle')
    expect(element).toHaveClass(heightClass)
    expect(element).toHaveClass(widthClass)
  })

  it('applies custom className', () => {
    render(<Toggle className="custom-class" data-testid="toggle" />)
    expect(screen.getByTestId('toggle')).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Toggle ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('calls onCheckedChange when clicked', () => {
    const handleChange = vi.fn()
    render(<Toggle onCheckedChange={handleChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('toggles state in uncontrolled mode', () => {
    render(<Toggle />)
    const toggle = screen.getByRole('switch')

    expect(toggle).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('respects defaultChecked prop', () => {
    render(<Toggle defaultChecked />)
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('does not toggle when disabled', () => {
    const handleChange = vi.fn()
    render(<Toggle disabled onCheckedChange={handleChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('applies disabled styles', () => {
    render(<Toggle disabled data-testid="toggle" />)
    const toggle = screen.getByTestId('toggle')
    expect(toggle).toBeDisabled()
    expect(toggle).toHaveClass('disabled:opacity-50')
  })

  it('renders with label on the right by default', () => {
    render(<Toggle label="Enable feature" />)
    expect(screen.getByText('Enable feature')).toBeInTheDocument()
  })

  it('renders with label on the left when specified', () => {
    render(<Toggle label="Enable feature" labelPosition="left" />)
    expect(screen.getByText('Enable feature')).toBeInTheDocument()
  })

  it('spreads additional props', () => {
    render(<Toggle data-testid="toggle" aria-label="test label" />)
    expect(screen.getByTestId('toggle')).toHaveAttribute('aria-label', 'test label')
  })
})
