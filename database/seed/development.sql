-- ============================================================
-- DistrictCore Development Seed
-- ============================================================

-- ============================================================
-- Departments
-- ============================================================

INSERT INTO departments (name, description)
VALUES ('Information Technology', 'Technology, infrastructure, applications, and security.');

INSERT INTO departments (name, description)
VALUES ('Human Resources', 'Employee management, recruitment, and HR operations.');

INSERT INTO departments (name, description)
VALUES ('Finance', 'Financial operations, accounting, and budgeting.');

INSERT INTO departments (name, description)
VALUES ('Operations', 'General organizational operations and management.');


-- ============================================================
-- Job Positions
-- ============================================================

INSERT INTO job_positions (department_id, name, description)
SELECT department_id,
       'ERP Programmer',
       'Develops and maintains ERP applications and integrations.'
FROM departments
WHERE name = 'Information Technology';

INSERT INTO job_positions (department_id, name, description)
SELECT department_id,
       'System Administrator',
       'Maintains systems, infrastructure, and enterprise services.'
FROM departments
WHERE name = 'Information Technology';

INSERT INTO job_positions (department_id, name, description)
SELECT department_id,
       'Cybersecurity Analyst',
       'Monitors and improves organizational security.'
FROM departments
WHERE name = 'Information Technology';

INSERT INTO job_positions (department_id, name, description)
SELECT department_id,
       'HR Specialist',
       'Manages employee records and HR processes.'
FROM departments
WHERE name = 'Human Resources';

INSERT INTO job_positions (department_id, name, description)
SELECT department_id,
       'HR Manager',
       'Manages HR operations and personnel processes.'
FROM departments
WHERE name = 'Human Resources';

INSERT INTO job_positions (department_id, name, description)
SELECT department_id,
       'Accountant',
       'Handles accounting and financial records.'
FROM departments
WHERE name = 'Finance';

INSERT INTO job_positions (department_id, name, description)
SELECT department_id,
       'Operations Manager',
       'Manages organizational operations.'
FROM departments
WHERE name = 'Operations';


-- ============================================================
-- Roles
-- ============================================================

INSERT INTO roles (name, description)
VALUES ('ADMIN', 'Full system administration access.');

INSERT INTO roles (name, description)
VALUES ('HR', 'Human resources access.');

INSERT INTO roles (name, description)
VALUES ('MANAGER', 'Management access to organizational data.');

INSERT INTO roles (name, description)
VALUES ('EMPLOYEE', 'Standard employee access.');


-- ============================================================
-- Permissions
-- ============================================================

INSERT INTO permissions (name, description)
VALUES ('employee.read', 'View employee records.');

INSERT INTO permissions (name, description)
VALUES ('employee.create', 'Create employee records.');

INSERT INTO permissions (name, description)
VALUES ('employee.update', 'Update employee records.');

INSERT INTO permissions (name, description)
VALUES ('employee.delete', 'Delete employee records.');

INSERT INTO permissions (name, description)
VALUES ('department.read', 'View departments.');

INSERT INTO permissions (name, description)
VALUES ('department.manage', 'Create and modify departments.');

INSERT INTO permissions (name, description)
VALUES ('user.read', 'View user accounts.');

INSERT INTO permissions (name, description)
VALUES ('user.manage', 'Manage user accounts.');

INSERT INTO permissions (name, description)
VALUES ('audit.read', 'View audit logs.');


-- ============================================================
-- Role Permissions
-- ============================================================

-- EMPLOYEE

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'EMPLOYEE'
  AND p.name IN (
      'employee.read',
      'department.read'
  );


-- MANAGER

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'MANAGER'
  AND p.name IN (
      'employee.read',
      'employee.create',
      'employee.update',
      'department.read'
  );


-- HR

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'HR'
  AND p.name IN (
      'employee.read',
      'employee.create',
      'employee.update',
      'employee.delete',
      'department.read',
      'user.read'
  );


-- ADMIN

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN'
  AND p.name IN (
      'employee.read',
      'employee.create',
      'employee.update',
      'employee.delete',
      'department.read',
      'department.manage',
      'user.read',
      'user.manage',
      'audit.read'
  );


COMMIT;