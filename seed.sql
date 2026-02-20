-- Seed a dummy merchant
INSERT INTO merchants (id, name, email, strictness_level, settlement_floor)
VALUES ('00000000-0000-0000-0000-000000000001', 'Venice Gym', 'gym@venice.com', 7, 0.75);

-- Seed a dummy debtor
INSERT INTO debtors (id, merchant_id, name, email, total_debt, status)
VALUES ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Yani', 'yani@example.com', 250.00, 'pending');
    