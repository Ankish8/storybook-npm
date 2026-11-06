import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stepper, stepperIndicatorVariants } from '../stepper'
import { assertNoBootstrapMarginBleed } from './utils/bootstrap-compat'

const steps = [{ label: 'Call Flow' }, { label: 'Campaign Details' }]

describe('Stepper', () => {
  it('renders all step labels', () => {
    render(<Stepper steps={steps} />)
    expect(screen.getByText('Call Flow')).toBeInTheDocument()
    expect(screen.getByText('Campaign Details')).toBeInTheDocument()
  })

  it('renders numbered indicators for current and pending steps', () => {
    render(<Stepper steps={steps} currentStep={0} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('marks current step with aria-current and pending/current styling', () => {
    render(<Stepper steps={steps} currentStep={0} />)
    const items = screen.getAllByRole('listitem').filter((li) => li.dataset.status)
    expect(items[0]).toHaveAttribute('aria-current', 'step')
    expect(items[0]).toHaveAttribute('data-status', 'current')
    expect(items[1]).toHaveAttribute('data-status', 'pending')
    expect(items[1]).not.toHaveAttribute('aria-current')
    expect(screen.getByText('1')).toHaveClass('border-semantic-border-primary', 'text-semantic-text-secondary', 'size-5')
    expect(screen.getByText('2')).toHaveClass('text-semantic-text-muted', 'bg-transparent')
  })

  it('renders completed step with check icon and primary label', () => {
    const { container } = render(<Stepper steps={steps} currentStep={1} />)
    expect(screen.queryByText('1')).not.toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.getByText('Call Flow')).toHaveClass('text-semantic-text-muted')
    expect(screen.getByText('(completed)')).toBeInTheDocument()
    expect(screen.getByText('Campaign Details')).toHaveClass('text-semantic-text-secondary')
  })

  it('pending label uses muted text', () => {
    render(<Stepper steps={steps} currentStep={0} />)
    expect(screen.getByText('Campaign Details')).toHaveClass('text-semantic-text-muted')
  })

  it('completed indicator variant classes', () => {
    expect(stepperIndicatorVariants({ status: 'completed' })).toContain('bg-semantic-text-secondary')
    expect(stepperIndicatorVariants({ status: 'completed' })).toContain('size-5')
  })

  it('renders one connector between steps', () => {
    const { container } = render(<Stepper steps={steps} />)
    expect(container.querySelectorAll('[data-slot="connector"]')).toHaveLength(1)
    const three = render(<Stepper steps={[...steps, { label: 'Review' }]} />)
    expect(three.container.querySelectorAll('[data-slot="connector"]')).toHaveLength(2)
  })

  it('merges custom className', () => {
    render(<Stepper steps={steps} className="custom-class" data-testid="s" />)
    const el = screen.getByTestId('s')
    expect(el).toHaveClass('custom-class')
    expect(el).toHaveClass('bg-semantic-bg-primary')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLOListElement>()
    render(<Stepper ref={ref} steps={steps} />)
    expect(ref.current).toBeInstanceOf(HTMLOListElement)
  })

  it('spreads extra props and has accessible name', () => {
    render(<Stepper steps={steps} data-testid="s" />)
    expect(screen.getByRole('list', { name: 'Progress' })).toBe(screen.getByTestId('s'))
  })

  it('has no Bootstrap margin bleed', () => {
    const { container } = render(<Stepper steps={steps} currentStep={1} />)
    assertNoBootstrapMarginBleed(container)
  })
})
