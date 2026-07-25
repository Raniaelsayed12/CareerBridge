# Seed Data

The project uses a local JSON database for demo and testing.

File:

`backend/local-db.json`

## Test Accounts

### Admin

Email: admin@test.de  
Password: Admin2026!Test  
Role: admin

### Hania

Email: hania@test.com  
Password: Hania2026!Test  
Role: user

### Rania

Email: rania@test.com  
Password: Rania2026!Test  
Role: user

### Aly

Email: aly@test.com  
Password: Aly2026!Test  
Role: user

## Purpose of Seed Data

The seed data makes it possible to test the application without creating new accounts manually.

It is used to test:

- login
- user-specific dashboards
- skills
- projects
- certificates
- admin management
- profile data
- resume data

## Data Separation

Each skill, project and certificate belongs to a specific user.

This is important because every normal user should only see their own data.  
The admin can view and manage data from all users.
