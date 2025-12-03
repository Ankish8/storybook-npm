import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../input'

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input data-testid="input" />)
    expect(screen.getByTestId('input')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('applies default state classes', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('border-[#E9E9E9]')
  })

  it.each([
    ['default', 'border-[#E9E9E9]'],
    ['error', 'border-[#FF3B3B]/40'],
  ] as const)('renders %s state', (state, expectedClass) => {
    render(<Input state={state} data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass(expectedClass)
  })

  it('applies base styling classes', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('h-10')
    expect(input).toHaveClass('w-full')
    expect(input).toHaveClass('rounded')
    expect(input).toHaveClass('px-4')
    expect(input).toHaveClass('py-2.5')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled data-testid="input" />)
    expect(screen.getByTestId('input')).toBeDisabled()
  })

  it('has disabled styling classes', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('disabled:cursor-not-allowed')
    expect(input).toHaveClass('disabled:opacity-50')
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('handles change events', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} data-testid="input" />)

    fireEvent.change(screen.getByTestId('input'), { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders with defaultValue', () => {
    render(<Input defaultValue="initial value" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveValue('initial value')
  })

  it('renders with controlled value', () => {
    render(<Input value="controlled value" onChange={() => {}} data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveValue('controlled value')
  })

  it('renders with type attribute', () => {
    render(<Input type="email" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email')
  })

  it('renders password type', () => {
    render(<Input type="password" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password')
  })

  it('renders file type', () => {
    render(<Input type="file" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'file')
  })

  it('spreads additional props', () => {
    render(<Input data-testid="input" aria-label="test input" autoComplete="email" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('aria-label', 'test input')
    expect(input).toHaveAttribute('autocomplete', 'email')
  })

  it('handles maxLength', () => {
    render(<Input maxLength={10} data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('maxlength', '10')
  })

  it('handles readOnly', () => {
    render(<Input readOnly defaultValue="read only" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('readonly')
  })

  it('handles required', () => {
    render(<Input required data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('required')
  })

  it('can be accessed by role', () => {
    render(<Input placeholder="Test" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
