# AIRA (AI Routing Assistant)

In many companies, employees often need help from different departments, but they don't always know who to contact. For example, issues might relate to IT, HR, or Facilities, and it can be confusing to figure out the right point of contact.
 
AIRA (AI Routing Assistant) LLM solves this problem. Employees can submit a message (a "ticket") through a website, and an AI agent reads the message, identifies the correct department using classification methods, and forwards the ticket accordingly. Department staff can then view and manage tickets through a dashboard.
 
It's like having a smart assistant that always knows who can solve your problem.

## Form Validation

I've implemented HTML form validation in the Login component as required for the project. Here's my submission with the key code snippets:
 
### login.jsx

```jsx
<input
  id="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  className="form-input"
  placeholder="Enter your email"
/>
```

### Email Type Validation
 
The input has type="email" which provides built-in format validation:
 
```jsx
<input
  id="email"
  type="email"
  ...
/>
```

### Form Submission Handling
 
I've implemented a form submission handler with validation:
 
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);
 
  try {
    await login(email, password);
    navigate('/dashboard');
  } catch (err) {
    setError(err.message); 
    console.error('Login error:', err);
  } finally {
    setIsLoading(false);
  }
};
```

## User Interface

### Ticket Submission
![Ticket Submission Form](aria-1.png)

### Staff Login Screen
![AIRA Login Screen](aria-2.png)

### Staff Dashboard
![Staff Dashboard](aria-3.png)

