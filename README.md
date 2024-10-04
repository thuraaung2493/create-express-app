# Expresso

A CLI tool for generating TypeScript-based Express applications focuses on API development. Additionally include file generating commands for `Controller` class, `Validation Schema`, and `Repository` class.

## Installation

```bash
# Global Install
npm install -g expresso

# Or
npx expresso
```

## How to use

### Create New App

```bash
npx expresso new my-express-app
```

### Create Controller Class

```bash
  npx expresso make:controller user
```

`UserController` class created in `./src/app/controllers/user.controller.ts`

### Create Repository Class

```bash
  npx expresso make:repository user
```

`UserRepository` class created in `./src/app/controllers/user.repository.ts`

### Create Validation Schema

```bash
  npx expresso make:schema user
```

The file user.schema.ts has been created in the `./src/app/validateSchema` directory.
