CREATE TABLE role_permissions (
    role_id NUMBER NOT NULL,
    permission_id NUMBER NOT NULL,

    CONSTRAINT pk_role_permissions
        PRIMARY KEY (role_id, permission_id),

    CONSTRAINT fk_roles_id
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id),

    CONSTRAINT fk_permissions_id
        FOREIGN KEY (permission_id)
        REFERENCES permissions(permission_id)
);