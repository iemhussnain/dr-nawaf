# Form Validation Guide

This document explains the form validation strategy used in the Dr. Nawaf Medical Center application.

## Validation Strategy

All forms in this application use **React Hook Form** with **Zod schema validation**. Browser-side HTML5 validation is **disabled** to prevent conflicts and ensure consistent validation behavior.

## Key Principle: noValidate Attribute

All `<form>` elements **MUST** include the `noValidate` attribute:

```jsx
<form onSubmit={handleSubmit} noValidate>
  {/* Form fields */}
</form>
```

### Why noValidate?

1. **Prevents Double Validation**: HTML5 and React Hook Form validation can conflict
2. **Consistent UX**: Custom error messages instead of browser default tooltips
3. **Better Control**: JavaScript validation provides more flexibility
4. **Cross-Browser Consistency**: Browser validation varies across browsers
5. **Accessibility**: Custom validation messages can be more accessible

## Form Validation Checklist

### ✅ All Forms Updated

The following forms have been updated with `noValidate`:

#### Authentication Forms
- [x] `/app/(auth)/login/page.js` - Login form
- [x] `/app/(auth)/register/page.js` - Registration form
- [x] `/app/(auth)/forgot-password/page.js` - Forgot password form
- [x] `/app/(auth)/reset-password/page.js` - Reset password form

#### User Forms
- [x] `/components/patient/ProfileForm.jsx` - Patient profile form
- [x] `/components/forms/DoctorForm.jsx` - Doctor form

#### Content Management Forms
- [x] `/components/forms/BlogForm.jsx` - Blog post form
- [x] `/components/forms/ServiceForm.jsx` - Service form
- [x] `/components/forms/ProductForm.jsx` - Product form

#### Search Forms
- [x] `/app/blog/page.js` - Blog search form
- [x] `/app/services/page.js` - Services search form
- [x] `/app/shop/page.js` - Shop search form
- [x] `/app/admin/blog/page.js` - Admin blog search
- [x] `/app/admin/services/page.js` - Admin services search

#### Checkout Forms
- [x] `/app/checkout/page.js` - Checkout form

## Implementation Examples

### Basic Form with Validation

```jsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data) => {
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input {...register("email")} type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register("password")} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  )
}
```

### Search Form (Simple Validation)

```jsx
export function SearchForm() {
  const [search, setSearch] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Perform search
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  )
}
```

### Form with File Upload

```jsx
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Image is required")
    .refine(
      (files) => files[0]?.size <= 5000000,
      "Max file size is 5MB"
    )
    .refine(
      (files) => ['image/jpeg', 'image/png'].includes(files[0]?.type),
      "Only JPEG and PNG images are allowed"
    ),
})

export function ImageUploadForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input {...register("title")} />
      {errors.title && <span>{errors.title.message}</span>}

      <input {...register("image")} type="file" accept="image/*" />
      {errors.image && <span>{errors.image.message}</span>}

      <button type="submit">Upload</button>
    </form>
  )
}
```

## Validation Rules

### Common Zod Schemas

```javascript
// Email validation
email: z.string().email("Invalid email address")

// Password validation
password: z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[a-z]/, "Must contain lowercase letter")
  .regex(/[0-9]/, "Must contain number")

// Phone validation
phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")

// Required string
name: z.string().min(1, "Name is required").trim()

// Optional string
notes: z.string().optional()

// Number with range
age: z.number().min(0).max(150)

// Price/Amount
price: z.number().positive("Price must be positive")

// Date
date: z.date().min(new Date(), "Date must be in the future")

// File upload
file: z
  .instanceof(FileList)
  .refine((files) => files.length > 0, "File is required")
  .refine((files) => files[0]?.size <= 5000000, "Max 5MB")
  .refine(
    (files) => ['image/jpeg', 'image/png'].includes(files[0]?.type),
    "Only JPEG/PNG allowed"
  )
```

## Error Display Patterns

### Inline Error Messages

```jsx
{errors.fieldName && (
  <span className="text-sm text-red-600 dark:text-red-400">
    {errors.fieldName.message}
  </span>
)}
```

### Error Summary

```jsx
{Object.keys(errors).length > 0 && (
  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
    <h3 className="font-semibold text-red-800 dark:text-red-400 mb-2">
      Please fix the following errors:
    </h3>
    <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
      {Object.values(errors).map((error, index) => (
        <li key={index}>{error.message}</li>
      ))}
    </ul>
  </div>
)}
```

## Server-Side Validation

Always validate on the server as well:

```javascript
// API route
import { z } from 'zod'
import { ValidationError } from '@/lib/errors'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const POST = async (req) => {
  const body = await req.json()

  try {
    const validated = schema.parse(body)
    // Process validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        'Validation failed',
        error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        }))
      )
    }
    throw error
  }
}
```

## Accessibility

### ARIA Labels

```jsx
<input
  {...register("email")}
  aria-invalid={errors.email ? "true" : "false"}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && (
  <span id="email-error" role="alert">
    {errors.email.message}
  </span>
)}
```

### Focus Management

```jsx
const { setFocus } = useForm()

useEffect(() => {
  if (Object.keys(errors).length > 0) {
    const firstError = Object.keys(errors)[0]
    setFocus(firstError)
  }
}, [errors, setFocus])
```

## Testing

### Unit Tests

```javascript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

test('shows validation error for invalid email', async () => {
  render(<LoginForm />)

  const emailInput = screen.getByLabelText(/email/i)
  const submitButton = screen.getByRole('button', { name: /login/i })

  await userEvent.type(emailInput, 'invalid-email')
  await userEvent.click(submitButton)

  await waitFor(() => {
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
  })
})
```

## Best Practices

1. **Always use noValidate** - Disable browser validation
2. **Validate twice** - Client-side (UX) and server-side (security)
3. **Clear error messages** - Tell users how to fix the error
4. **Real-time validation** - Validate on blur for better UX
5. **Accessible errors** - Use ARIA attributes
6. **Sanitize inputs** - Use sanitization middleware on server
7. **Type safety** - Use TypeScript with Zod for type inference
8. **Consistent patterns** - Follow the same validation approach everywhere

## Common Mistakes to Avoid

❌ **Don't** rely only on client-side validation
❌ **Don't** use HTML5 validation with React Hook Form
❌ **Don't** forget to sanitize inputs on the server
❌ **Don't** expose technical errors to users
❌ **Don't** validate on every keystroke (use onBlur instead)

✅ **Do** use noValidate on all forms
✅ **Do** validate on both client and server
✅ **Do** provide clear, actionable error messages
✅ **Do** sanitize all user inputs
✅ **Do** use Zod for schema validation

## Migration Guide

If you have existing forms without noValidate:

1. Add `noValidate` to the `<form>` element
2. Ensure React Hook Form is set up with Zod resolver
3. Add inline error displays for all fields
4. Test the form thoroughly
5. Update any related API endpoints to use server-side validation

## Resources

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [Web Forms Accessibility](https://www.w3.org/WAI/tutorials/forms/)

---

**Last Updated**: November 16, 2025
**Validation Strategy**: React Hook Form + Zod (no HTML5 validation)
