INSERT INTO permissions (
    name,
    description
)
VALUES (
    'job_position.read',
    'View job positions.'
);

INSERT INTO permissions (
    name,
    description
)
VALUES (
    'job_position.manage',
    'Create, update, and delete job positions.'
);

-- ADMN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN'
  AND p.name IN ('job_position.read', 'job_position.manage');

-- HR
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'HR'
  AND p.name IN ('job_position.read', 'job_position.manage');

-- MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'MANAGER'
  AND p.name = 'job_position.read';

-- EMPOYEE
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'EMPLOYEE'
  AND p.name = 'job_position.read';