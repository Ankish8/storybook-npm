import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from '../switch'

describe('Switch', () => {
  it('renders correctly', () => {
    render(<Switch data-testid="switch" />)
    expect(screen.getByTestId('switch')).toBeInTheDocument()
  })

  it('renders with role="switch"', () => {
    render(<Switch />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('renders unchecked by default', () => {
    render(<Switch />)
    const switchEl = screen.getByRole('switch')
    expect(switchEl).toHaveAttribute('data-state', 'unchecked')
  })

  it('renders checked state correctly', () => {
    render(<Switch checked />)
    const switchEl = screen.getByRole('switch')
    expect(switchEl).toHaveAttribute('data-state', 'checked')
  })

  it.each([
    ['default', 'h-6', 'w-11'],
    ['sm', 'h-5', 'w-9'],
    ['lg', 'h-7', 'w-14'],
  ] as const)('renders %s size', (size, heightClass, widthClass) => {
    render(<Switch size={size} data-testid="switch" />)
    const element = screen.getByTestId('switch')
    expect(element).toHaveClass(heightClass)
    expect(element).toHaveClass(widthClass)
  })

  it('applies custom className', () => {
    render(<Switch className="custom-class" data-testid="switch" />)
    expect(screen.getByTestId('switch')).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Switch ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('calls onCheckedChange when clicked', () => {
    const handleChange = vi.fn()
    render(<Switch onCheckedChange={handleChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('toggles state in uncontrolled mode', () => {
    render(<Switch />)
    const switchEl = screen.getByRole('switch')

    expect(switchEl).toHaveAttribute('data-state', 'unchecked')
    fireEvent.click(switchEl)
    expect(switchEl).toHaveAttribute('data-state', 'checked')
    fireEvent.click(switchEl)
    expect(switchEl).toHaveAttribute('data-state', 'unchecked')
  })

  it('respects defaultChecked prop', () => {
    render(<Switch defaultChecked />)
    const switchEl = screen.getByRole('switch')
    expect(switchEl).toHaveAttribute('data-state', 'checked')
  })

  it('does not toggle when disabled', () => {
    const handleChange = vi.fn()
    render(<Switch disabled onCheckedChange={handleChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('applies disabled state', () => {
    render(<Switch disabled data-testid="switch" />)
    const switchEl = screen.getByTestId('switch')
    expect(switchEl).toBeDisabled()
  })

  it('renders with label on the right by default', () => {
    render(<Switch label="Enable feature" />)
    expect(screen.getByText('Enable feature')).toBeInTheDocument()
  })

  it('renders with label on the left when specified', () => {
    render(<Switch label="Enable feature" labelPosition="left" />)
    expect(screen.getByText('Enable feature')).toBeInTheDocument()
  })

  it('spreads additional props', () => {
    render(<Switch data-testid="switch" aria-label="test label" />)
    expect(screen.getByTestId('switch')).toHaveAttribute('aria-label', 'test label')
  })
})
