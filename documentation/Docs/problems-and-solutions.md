# Problems and Solutions

During the development of CareerBridge, several technical problems appeared.

## 1. MongoDB Connection Problem

At the beginning, the backend was planned with MongoDB.

However, the MongoDB connection produced SSL and server selection errors.

### Solution

A local JSON database was implemented as a stable demo fallback.

This made the project easier to test and present locally.

## 2. User Data Was Not Separated

At first, skills, projects and certificates were global.

That means all users could see the same data.

### Solution

A `userId` field was added to skills, projects and certificates.

Now each normal user sees only their own data.

The admin can still manage all data.

## 3. Login Flow Problems

There were problems with users being redirected to the wrong page or staying logged in automatically.

### Solution

The login flow was improved.

After login, users go to the Home page and can navigate to Dashboard, Skills, Projects or Certificates.

The user session is managed with Pinia.

## 4. Admin Access

The Admin page had to be visible only for the admin account.

### Solution

The navigation checks the current user's role.

Only the admin can see the Admin link.

Normal users cannot access the Admin page.

## 5. Profile Role Problem

At first, normal users could potentially edit role-related information.

### Solution

The system role was separated from the professional title.

Normal users can edit their professional title, but they cannot change their system role.

## 6. Missing Documentation Viewer

The project documentation existed as markdown files, but it was not visible inside the application.

### Solution

A Docs page was added.

It loads markdown files from the backend and displays them inside the frontend.

## 7. GitHub Structure and Private Screenshots

Some screenshots and files were not clean for the final repository.

### Solution

Private screenshots were removed.

The repository structure was cleaned and organized into:

- backend
- frontend
- documentation
- README
- Development Journal
