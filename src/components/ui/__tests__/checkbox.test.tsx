import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from '../checkbox'

describe('Checkbox', () => {
  it('renders correctly', () => {
    render(<Checkbox data-testid="checkbox" />)
    expect(screen.getByTestId('checkbox')).toBeInTheDocument()
  })

  it('renders with role="checkbox"', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders unchecked by default', () => {
    render(<Checkbox data-testid="checkbox" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
    expect(checkbox).toHaveClass('bg-white')
    expect(checkbox).toHaveClass('border-[#E5E7EB]')
  })

  it('renders checked state correctly', () => {
    render(<Checkbox checked data-testid="checkbox" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-checked', 'true')
    expect(checkbox).toHaveClass('bg-[#343E55]')
    expect(checkbox).toHaveClass('border-[#343E55]')
  })

  it('renders indeterminate state correctly', () => {
    render(<Checkbox checked="indeterminate" data-testid="checkbox" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    expect(checkbox).toHaveClass('bg-[#343E55]')
    expect(checkbox).toHaveClass('border-[#343E55]')
  })

  it.each([
    ['default', 'h-5', 'w-5'],
    ['sm', 'h-4', 'w-4'],
    ['lg', 'h-6', 'w-6'],
  ] as const)('renders %s size', (size, heightClass, widthClass) => {
    render(<Checkbox size={size} data-testid="checkbox" />)
    const element = screen.getByTestId('checkbox')
    expect(element).toHaveClass(heightClass)
    expect(element).toHaveClass(widthClass)
  })

  it('applies custom className', () => {
    render(<Checkbox className="custom-class" data-testid="checkbox" />)
    expect(screen.getByTestId('checkbox')).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Checkbox ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('calls onCheckedChange when clicked', () => {
    const handleChange = vi.fn()
    render(<Checkbox onCheckedChange={handleChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('toggles state in uncontrolled mode', () => {
    render(<Checkbox />)
    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(checkbox)
    expect(checkbox).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(checkbox)
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
  })

  it('respects defaultChecked prop', () => {
    render(<Checkbox defaultChecked />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-checked', 'true')
  })

  it('does not toggle when disabled', () => {
    const handleChange = vi.fn()
    render(<Checkbox disabled onCheckedChange={handleChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('applies disabled styles', () => {
    render(<Checkbox disabled data-testid="checkbox" />)
    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox).toBeDisabled()
    expect(checkbox).toHaveClass('disabled:opacity-50')
  })

  it('renders with label on the right by default', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByText('Accept terms')).toBeInTheDocument()
  })

  it('renders with label on the left when specified', () => {
    render(<Checkbox label="Accept terms" labelPosition="left" />)
    expect(screen.getByText('Accept terms')).toBeInTheDocument()
  })

  it('clicking from indeterminate goes to checked', () => {
    const handleChange = vi.fn()
    render(<Checkbox checked="indeterminate" onCheckedChange={handleChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('clicking from checked goes to unchecked', () => {
    const handleChange = vi.fn()
    render(<Checkbox checked onCheckedChange={handleChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledWith(false)
  })

  it('spreads additional props', () => {
    render(<Checkbox data-testid="checkbox" aria-label="test label" />)
    expect(screen.getByTestId('checkbox')).toHaveAttribute('aria-label', 'test label')
  })

  it('renders check icon when checked', () => {
    const { container } = render(<Checkbox checked />)
    // Check icon should be present (lucide-react Check component renders an svg)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders minus icon when indeterminate', () => {
    const { container } = render(<Checkbox checked="indeterminate" />)
    // Minus icon should be present
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders no icon when unchecked', () => {
    const { container } = render(<Checkbox />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  // New props tests
  describe('New accessibility props', () => {
    it('applies ariaLabel prop as aria-label attribute', () => {
      render(<Checkbox ariaLabel="Custom accessible label" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-label', 'Custom accessible label')
    })

    it('applies ariaLabelledBy prop as aria-labelledby attribute', () => {
      render(
        <>
          <span id="external-label">External Label</span>
          <Checkbox ariaLabelledBy="external-label" />
        </>
      )
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-labelledby', 'external-label')
    })

    it('applies id prop to checkbox element', () => {
      render(<Checkbox id="my-checkbox" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('id', 'my-checkbox')
    })
  })

  describe('autoFocus prop', () => {
    it('focuses checkbox on mount when autoFocus is true', () => {
      render(<Checkbox autoFocus data-testid="checkbox" />)
      const checkbox = screen.getByTestId('checkbox')
      expect(checkbox).toHaveFocus()
    })

    it('does not focus checkbox on mount when autoFocus is false', () => {
      render(<Checkbox data-testid="checkbox" />)
      const checkbox = screen.getByTestId('checkbox')
      expect(checkbox).not.toHaveFocus()
    })
  })

  describe('Custom className props', () => {
    it('applies checkboxClassName to checkbox element', () => {
      render(<Checkbox checkboxClassName="custom-checkbox-class" data-testid="checkbox" />)
      const checkbox = screen.getByTestId('checkbox')
      expect(checkbox).toHaveClass('custom-checkbox-class')
    })

    it('applies labelClassName to label text', () => {
      render(<Checkbox label="Test Label" labelClassName="custom-label-class" />)
      const labelText = screen.getByText('Test Label')
      expect(labelText).toHaveClass('custom-label-class')
    })

    it('applies both className and checkboxClassName', () => {
      render(<Checkbox className="class-a" checkboxClassName="class-b" data-testid="checkbox" />)
      const checkbox = screen.getByTestId('checkbox')
      expect(checkbox).toHaveClass('class-a')
      expect(checkbox).toHaveClass('class-b')
    })
  })

  describe('Form metadata props', () => {
    it('stores name prop as data-name attribute', () => {
      render(<Checkbox name="newsletter" data-testid="checkbox" />)
      const checkbox = screen.getByTestId('checkbox')
      expect(checkbox).toHaveAttribute('data-name', 'newsletter')
    })

    it('stores value prop as data-value attribute', () => {
      render(<Checkbox value="subscribed" data-testid="checkbox" />)
      const checkbox = screen.getByTestId('checkbox')
      expect(checkbox).toHaveAttribute('data-value', 'subscribed')
    })
  })

  describe('separateLabel prop', () => {
    it('renders with htmlFor/id association when separateLabel is true', () => {
      render(<Checkbox id="terms-checkbox" label="Accept terms" separateLabel />)
      const checkbox = screen.getByRole('checkbox')
      const label = screen.getByText('Accept terms')

      expect(checkbox).toHaveAttribute('id', 'terms-checkbox')
      expect(label.tagName).toBe('LABEL')
      expect(label).toHaveAttribute('for', 'terms-checkbox')
    })

    it('renders wrapping label when separateLabel is false', () => {
      render(<Checkbox label="Accept terms" />)
      const label = screen.getByText('Accept terms')

      // In default mode, label text is in a span, not a label with htmlFor
      expect(label.tagName).toBe('SPAN')
    })

    it('falls back to wrapping label when separateLabel is true but id is missing', () => {
      render(<Checkbox label="Accept terms" separateLabel />)
      const label = screen.getByText('Accept terms')

      // Without id, falls back to wrapping span
      expect(label.tagName).toBe('SPAN')
    })

    it('clicking separate label toggles checkbox', () => {
      const handleChange = vi.fn()
      render(
        <Checkbox
          id="clickable-label"
          label="Click me"
          separateLabel
          onCheckedChange={handleChange}
        />
      )

      const label = screen.getByText('Click me')
      fireEvent.click(label)
      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('applies labelClassName in separateLabel mode', () => {
      render(
        <Checkbox
          id="styled-label"
          label="Styled Label"
          separateLabel
          labelClassName="my-label-style"
        />
      )
      const label = screen.getByText('Styled Label')
      expect(label).toHaveClass('my-label-style')
    })

    it('handles labelPosition in separateLabel mode', () => {
      const { container } = render(
        <Checkbox
          id="left-label"
          label="Left Label"
          labelPosition="left"
          separateLabel
        />
      )

      // Check that label comes before checkbox in the DOM
      const wrapper = container.firstChild
      expect(wrapper?.firstChild?.textContent).toBe('Left Label')
    })
  })
})
