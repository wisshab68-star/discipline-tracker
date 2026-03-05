import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
  asChild?: boolean
}

const variantClasses: Record<string, string> = {
  default: 'btn btn-default',
  outline: 'btn btn-outline',
  ghost: 'btn btn-ghost',
  destructive: 'btn btn-default',
}

const sizeClasses: Record<string, string> = {
  default: '',
  sm: 'btn-sm',
  lg: 'btn-lg',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const classes = [variantClasses[variant] || variantClasses.default, sizeClasses[size]]
    if (className) classes.push(className)
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={classes.join(' ')}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
