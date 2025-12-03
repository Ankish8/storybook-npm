import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextField } from '../text-field'

describe('TextField', () => {
  // Basic rendering
  it('renders correctly', () => {
    render(<TextField data-testid="input" />)
    expect(screen.getByTestId('input')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<TextField placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  // Label tests
  it('renders label when provided', () => {
    render(<TextField label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders required indicator when required', () => {
    render(<TextField label="Email" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('*')).toHaveClass('text-[#FF3B3B]')
  })

  it('does not render required indicator when not required', () => {
    render(<TextField label="Email" />)
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('associates label with input via htmlFor', () => {
    render(<TextField label="Email" id="email-input" />)
    const label = screen.getByText('Email')
    expect(label).toHaveAttribute('for', 'email-input')
  })

  // State tests
  it('applies error state styling when error is set', () => {
    render(<TextField error="Error" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveClass('border-[#FF3B3B]/40')
  })

  it('sets aria-invalid when error is present', () => {
    render(<TextField error="Error" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true')
  })

  // Helper text tests
  it('renders helper text when provided', () => {
    render(<TextField helperText="We will never share your email" />)
    expect(screen.getByText('We will never share your email')).toBeInTheDocument()
    expect(screen.getByText('We will never share your email')).toHaveClass('text-[#6B7280]')
  })

  // Error message tests
  it('shows error message when error prop is set', () => {
    render(<TextField error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByText('This field is required')).toHaveClass('text-[#FF3B3B]')
  })

  it('error message takes precedence over helper text', () => {
    render(<TextField helperText="Helper" error="Error" />)
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
  })

  // Icons tests
  it('renders left icon when provided', () => {
    render(<TextField leftIcon={<span data-testid="left-icon">L</span>} />)
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('renders right icon when provided', () => {
    render(<TextField rightIcon={<span data-testid="right-icon">R</span>} />)
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('renders both icons when provided', () => {
    render(
      <TextField
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      />
    )
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  // Prefix/Suffix tests
  it('renders prefix when provided', () => {
    render(<TextField prefix="https://" />)
    expect(screen.getByText('https://')).toBeInTheDocument()
  })

  it('renders suffix when provided', () => {
    render(<TextField suffix=".com" />)
    expect(screen.getByText('.com')).toBeInTheDocument()
  })

  it('renders both prefix and suffix', () => {
    render(<TextField prefix="https://" suffix=".com" />)
    expect(screen.getByText('https://')).toBeInTheDocument()
    expect(screen.getByText('.com')).toBeInTheDocument()
  })

  // Character count tests
  it('shows character count when showCount and maxLength are set', () => {
    render(<TextField showCount maxLength={20} defaultValue="test" />)
    expect(screen.getByText('4/20')).toBeInTheDocument()
  })

  it('updates character count on input', async () => {
    const user = userEvent.setup()
    render(<TextField showCount maxLength={20} data-testid="input" />)

    await user.type(screen.getByTestId('input'), 'hello')
    expect(screen.getByText('5/20')).toBeInTheDocument()
  })

  it('shows character count in red when over limit', () => {
    render(<TextField showCount maxLength={3} defaultValue="hello" />)
    expect(screen.getByText('5/3')).toHaveClass('text-[#FF3B3B]')
  })

  // Loading state tests
  it('disables input when loading', () => {
    render(<TextField loading data-testid="input" />)
    expect(screen.getByTestId('input')).toBeDisabled()
  })

  it('shows spinner when loading', () => {
    const { container } = render(<TextField loading />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('hides right icon when loading', () => {
    render(<TextField loading rightIcon={<span data-testid="right-icon">R</span>} />)
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument()
  })

  // Disabled state tests
  it('applies disabled state correctly', () => {
    render(<TextField disabled data-testid="input" />)
    expect(screen.getByTestId('input')).toBeDisabled()
  })

  // Controlled mode tests
  it('works in controlled mode', () => {
    const handleChange = vi.fn()
    render(<TextField value="test" onChange={handleChange} data-testid="input" />)

    const input = screen.getByTestId('input')
    expect(input).toHaveValue('test')

    fireEvent.change(input, { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalled()
  })

  // Uncontrolled mode tests
  it('works in uncontrolled mode', async () => {
    const user = userEvent.setup()
    render(<TextField defaultValue="initial" data-testid="input" />)

    const input = screen.getByTestId('input')
    expect(input).toHaveValue('initial')

    await user.clear(input)
    await user.type(input, 'new value')
    expect(input).toHaveValue('new value')
  })

  // Ref forwarding tests
  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<TextField ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  // Custom className tests
  it('applies custom className to input without addons', () => {
    render(<TextField className="custom-class" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveClass('custom-class')
  })

  it('applies custom wrapperClassName', () => {
    const { container } = render(<TextField wrapperClassName="wrapper-class" />)
    expect(container.firstChild).toHaveClass('wrapper-class')
  })

  it('applies custom labelClassName', () => {
    render(<TextField label="Test" labelClassName="label-class" />)
    expect(screen.getByText('Test')).toHaveClass('label-class')
  })

  // Accessibility tests
  it('sets aria-describedby for helper text', () => {
    render(<TextField helperText="Helper" id="test" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('aria-describedby', 'test-helper')
  })

  it('sets aria-describedby for error message', () => {
    render(<TextField error="Error" id="test" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('aria-describedby', 'test-error')
  })

  // Props spreading tests
  it('spreads additional props to input', () => {
    render(<TextField data-testid="input" aria-label="test input" autoComplete="email" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('aria-label', 'test input')
    expect(input).toHaveAttribute('autocomplete', 'email')
  })

  // Input type tests
  it('renders with type attribute', () => {
    render(<TextField type="email" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email')
  })

  it('renders password type', () => {
    render(<TextField type="password" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password')
  })

  // Container styling with addons
  it('uses container with focus-within styling when has addons', () => {
    const { container } = render(<TextField leftIcon={<span>L</span>} />)
    const inputContainer = container.querySelector('.focus-within\\:border-\\[\\#2BBBC9\\]\\/50')
    expect(inputContainer).toBeInTheDocument()
  })

  it('applies error state to container when has addons', () => {
    const { container } = render(<TextField leftIcon={<span>L</span>} error="Error" />)
    const inputContainer = container.querySelector('.border-\\[\\#FF3B3B\\]\\/40')
    expect(inputContainer).toBeInTheDocument()
  })
})
