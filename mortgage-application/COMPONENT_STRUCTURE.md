# Mortgage Application Component Structure Documentation

## Overview

This document provides a comprehensive overview of the component structure for the Barclays Mortgage Application SPA. The application is built using React, TypeScript, and follows a feature-based architecture with Redux for state management.

## Project Structure

```
src/
├── barclays-mortgage-application.tsx - Main entry point
├── components/ - Shared components
├── declarations.d.ts - TypeScript declarations
├── features/ - Feature modules
│   └── financial-details/ - Financial details feature
├── mocks/ - Mock API services
├── root.component.tsx - Root React component
└── store/ - Redux store configuration
```

## Component Hierarchy

### Root Level

- **MortgageApplication** (`root.component.tsx`)
  - Entry point for the application
  - Initializes MSW for API mocking
  - Provides Redux store
  - Handles routing between main sections

### Financial Details Feature

#### Container Components

- **FinancialDetailsContainer** (`FinancialDetailsContainer.tsx`)
  - Wrapper for the financial details feature
  - Provides context providers and layout structure

#### Page Components

- **FinancialDetailsPage** (`FinancialDetailsPage.tsx`)
  - Main page for financial details section
  - Integrates with navigation context
  - Composes form and list components

- **DebtConsolidationPage** (`DebtConsolidationPage.tsx`)
  - Page for debt consolidation options
  - Handles debt consolidation specific logic

#### Form Components

- **CommitmentForm** (`CommitmentForm.tsx`)
  - Container for commitment form fields
  - Handles form submission and validation logic
  - Uses React Hook Form for form state management

- **CommitmentsList** (`CommitmentsList.tsx`)
  - Displays list of financial commitments
  - Handles CRUD operations for commitments

#### Form Field Components

Located in `form-fields/` directory:

- **CommitmentFormFields** (`CommitmentFormFields.tsx`)
  - Contains individual field components:
    - `TypeSelector` - For selecting commitment type
    - `BalanceField` - For entering balance amounts
    - `MonthlyPaymentField` - For monthly payment amounts
    - `CompletionStatusSelector` - For selecting completion status
    - `RepaymentAmountField` - For repayment amounts
    - `NotesField` - For additional notes
    - `IncludeInMortgageField` - For including in mortgage option

#### Field Configuration

- **CommitmentFieldConfig** (`CommitmentFieldConfig.ts`)
  - Defines field requirements based on commitment type
  - Contains:
    - `FieldConfig` interface - Defines field configuration properties
    - `baseFieldConfig` - Default configuration for most commitment types
    - `commitmentTypeConfigs` - Special configurations for specific commitment types
    - `completionStatusConfigs` - Configurations based on completion status
    - `getFieldConfig()` - Function to combine type and status configurations
    - `shouldShowField()` - Helper to determine field visibility

## Context System

### Navigation Context

- **NavigationContext** (`NavigationContext.tsx`)
  - Manages navigation state between different steps
  - Provides:
    - `FinancialDetailsStep` enum - Defines available steps
    - `NavigationProvider` - Context provider component
    - `useNavigation` - Custom hook for accessing navigation context
  - Navigation functions:
    - `navigateToNext()` - Move to next step
    - `navigateToPrevious()` - Move to previous step
    - `navigateToStep()` - Navigate to specific step

## State Management

### Redux Store

- Located in `store/` directory
- Manages application state using Redux Toolkit

### Form State

- Managed by React Hook Form within form components
- Validation rules defined in each form field component

## Component Communication Patterns

The application uses a combination of:

1. **Props** - For parent-child component communication
2. **Context** - For cross-component state sharing (e.g., navigation)
3. **Redux** - For global state management

## Form Field Component Pattern

The form field components follow a consistent pattern:

1. Each component accepts common props:
   - `control` - From React Hook Form for field registration
   - `errors` - For validation error handling
   - `fieldConfig` - For field-specific configuration

2. Components use the Controller component from React Hook Form to:
   - Register fields with validation rules
   - Handle field value changes
   - Display validation errors

3. Field visibility and behavior are determined by the configuration from `CommitmentFieldConfig.ts`

## Data Flow

1. User inputs data in form fields
2. React Hook Form manages form state and validation
3. On form submission, data is dispatched to Redux store
4. Redux actions update the application state
5. Components re-render based on updated state

## Best Practices

- **Component Composition**: Components are composed of smaller, reusable components
- **Separation of Concerns**: Clear separation between UI components, business logic, and state management
- **Context for Cross-Component State**: Using React Context for state that needs to be shared across components
- **Dynamic Form Rendering**: Form fields are rendered dynamically based on configuration
- **Consistent Validation**: Form validation is handled consistently using React Hook Form
