import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MultiSelect, type MultiSelectOption } from '../multi-select'

const defaultOptions: MultiSelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

describe('MultiSelect', () => {
  // Basic rendering
  it('renders correctly', () => {
    render(<MultiSelect options={defaultOptions} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders placeholder text', () => {
    render(<MultiSelect options={defaultOptions} placeholder="Select options" />)
    expect(screen.getByText('Select options')).toBeInTheDocument()
  })

  // Label tests
  it('renders label when provided', () => {
    render(<MultiSelect label="Test Label" options={defaultOptions} />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('renders required indicator when required', () => {
    render(<MultiSelect label="Test Label" options={defaultOptions} required />)
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('*')).toHaveClass('text-[#F04438]')
  })

  // Helper text tests
  it('renders helper text when provided', () => {
    render(<MultiSelect options={defaultOptions} helperText="Helper text" />)
    expect(screen.getByText('Helper text')).toBeInTheDocument()
    expect(screen.getByText('Helper text')).toHaveClass('text-[#717680]')
  })

  // Error message tests
  it('shows error message when error prop is set', () => {
    render(<MultiSelect options={defaultOptions} error="Required field" />)
    expect(screen.getByText('Required field')).toBeInTheDocument()
    expect(screen.getByText('Required field')).toHaveClass('text-[#F04438]')
  })

  it('error message takes precedence over helper text', () => {
    render(
      <MultiSelect
        options={defaultOptions}
        helperText="Helper"
        error="Error"
      />
    )
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
  })

  it('applies error state styling when error is set', () => {
    render(<MultiSelect options={defaultOptions} error="Error" />)
    expect(screen.getByRole('combobox')).toHaveClass('border-[#F04438]/40')
  })

  // Dropdown interaction
  it('opens dropdown on click', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={defaultOptions} />)

    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('shows options when opened', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={defaultOptions} />)

    await user.click(screen.getByRole('combobox'))
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  // Selection tests
  it('selects option on click', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={defaultOptions} />)

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Option 1'))

    // Tag should appear - there will be 2 elements (tag + option in dropdown)
    const option1Elements = screen.getAllByText('Option 1')
    expect(option1Elements.length).toBeGreaterThan(0)
    // Check that the remove button exists (which means a tag was created)
    expect(screen.getByLabelText('Remove Option 1')).toBeInTheDocument()
  })

  it('allows multiple selections', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={defaultOptions} />)

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Option 1'))
    await user.click(screen.getByText('Option 2'))

    // Both tags should appear
    const option1Tags = screen.getAllByText('Option 1')
    const option2Tags = screen.getAllByText('Option 2')
    expect(option1Tags.length).toBeGreaterThan(0)
    expect(option2Tags.length).toBeGreaterThan(0)
  })

  it('deselects option on second click', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={defaultOptions} defaultValue={['option1']} />)

    await user.click(screen.getByRole('combobox'))
    // Find the option in the dropdown and click it
    const optionInDropdown = screen.getByRole('option', { name: 'Option 1' })
    await user.click(optionInDropdown)

    // Tag should be removed, but placeholder should appear since all are deselected
    expect(screen.queryByLabelText('Remove Option 1')).not.toBeInTheDocument()
  })

  // Default value
  it('shows default values as tags', () => {
    render(
      <MultiSelect
        options={defaultOptions}
        defaultValue={['option1', 'option2']}
      />
    )

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  // Remove tag
  it('removes tag when X is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MultiSelect
        options={defaultOptions}
        defaultValue={['option1', 'option2']}
      />
    )

    await user.click(screen.getByLabelText('Remove Option 1'))

    expect(screen.queryByLabelText('Remove Option 1')).not.toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  // Clear all
  it('clears all selections when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MultiSelect
        options={defaultOptions}
        defaultValue={['option1', 'option2']}
      />
    )

    await user.click(screen.getByLabelText('Clear all'))

    expect(screen.queryByLabelText('Remove Option 1')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Remove Option 2')).not.toBeInTheDocument()
  })

  // Controlled mode
  it('works in controlled mode', async () => {
    const handleValueChange = vi.fn()
    const user = userEvent.setup()

    render(
      <MultiSelect
        options={defaultOptions}
        value={['option1']}
        onValueChange={handleValueChange}
      />
    )

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Option 2'))

    expect(handleValueChange).toHaveBeenCalledWith(['option1', 'option2'])
  })

  // Max selections
  it('enforces max selections', async () => {
    const user = userEvent.setup()
    render(
      <MultiSelect
        options={defaultOptions}
        maxSelections={2}
        defaultValue={['option1', 'option2']}
      />
    )

    await user.click(screen.getByRole('combobox'))
    const option3 = screen.getByRole('option', { name: 'Option 3' })

    // Option 3 should be disabled (has opacity-50 class)
    expect(option3).toHaveClass('opacity-50')
  })

  it('shows selection count when maxSelections is set', async () => {
    const user = userEvent.setup()
    render(
      <MultiSelect
        options={defaultOptions}
        maxSelections={3}
        defaultValue={['option1']}
      />
    )

    await user.click(screen.getByRole('combobox'))
    expect(screen.getByText('1 / 3 selected')).toBeInTheDocument()
  })

  // Searchable
  it('shows search input when searchable', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={defaultOptions} searchable />)

    await user.click(screen.getByRole('combobox'))
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('filters options when searching', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={defaultOptions} searchable />)

    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByPlaceholderText('Search...'), 'Option 1')

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Option 2' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Option 3' })).not.toBeInTheDocument()
  })

  it('shows no results message when search has no matches', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={defaultOptions} searchable />)

    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByPlaceholderText('Search...'), 'xyz')

    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  // Disabled state
  it('is disabled when disabled prop is set', () => {
    render(<MultiSelect options={defaultOptions} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('does not open when disabled', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={defaultOptions} disabled />)

    await user.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  // Loading state
  it('is disabled when loading', () => {
    render(<MultiSelect options={defaultOptions} loading />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('shows spinner when loading', () => {
    const { container } = render(<MultiSelect options={defaultOptions} loading />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  // Disabled options
  it('renders disabled options', async () => {
    const optionsWithDisabled: MultiSelectOption[] = [
      { value: 'enabled', label: 'Enabled' },
      { value: 'disabled', label: 'Disabled', disabled: true },
    ]
    const user = userEvent.setup()

    render(<MultiSelect options={optionsWithDisabled} />)

    await user.click(screen.getByRole('combobox'))
    const disabledOption = screen.getByRole('option', { name: 'Disabled' })
    expect(disabledOption).toHaveClass('opacity-50')
  })

  // Custom classNames
  it('applies custom wrapperClassName', () => {
    const { container } = render(
      <MultiSelect options={defaultOptions} wrapperClassName="custom-wrapper" />
    )
    expect(container.firstChild).toHaveClass('custom-wrapper')
  })

  it('applies custom triggerClassName', () => {
    render(<MultiSelect options={defaultOptions} triggerClassName="custom-trigger" />)
    expect(screen.getByRole('combobox')).toHaveClass('custom-trigger')
  })

  // Accessibility
  it('has combobox role', () => {
    render(<MultiSelect options={defaultOptions} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('has proper aria-expanded state', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={defaultOptions} />)

    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('sets aria-invalid when error is present', () => {
    render(<MultiSelect options={defaultOptions} error="Error" />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  // Keyboard navigation
  it('closes dropdown on Escape', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={defaultOptions} />)

    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
