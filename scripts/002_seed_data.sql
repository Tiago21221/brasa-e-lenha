-- Insert categories
INSERT INTO categories (name, slug, display_order) VALUES
('Pratos Principais', 'pratos-principais', 1),
('Porções', 'porcoes', 2),
('Sanduíches', 'sanduiches', 3),
('Bebidas', 'bebidas', 4)
ON CONFLICT (slug) DO NOTHING;

-- Adding all products with correct image paths matching the files in public folder

-- Insert products (Pratos Principais)
INSERT INTO products (category_id, name, description, price_in_cents, image_url, available) VALUES
(
  (SELECT id FROM categories WHERE slug = 'pratos-principais'),
  'Escondidinho de Costela Defumada',
  'Delicioso escondidinho de costela bovina defumada com purê de mandioca gratinado',
  3500,
  '/Escondidinho de Costela Defumada.jpg',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'pratos-principais'),
  'Mac''n''Cheese Defumado com Cubos de Carne',
  'Macarrão cremoso com queijos especiais e cubos de carne defumada',
  3200,
  '/Mac''n''Cheese Defumado com Cubos de Carne.jpeg',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'pratos-principais'),
  'Picanha na Brasa com Arroz e Vinagrete',
  'Suculenta picanha grelhada ao ponto servida com arroz e vinagrete',
  4500,
  '/Picanha na Brasa com Arroz e Vinagrete.jpg',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'pratos-principais'),
  'Fraldinha Grelhada com Batata Rústica',
  'Fraldinha macia grelhada na brasa servida com batatas rústicas',
  4200,
  '/Fraldinha Grelhada com Batata Rústica.jpg',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'pratos-principais'),
  'Filé Grelhado com Alho, Farofa e Arroz de Couve',
  'Filé mignon grelhado com alho, farofa crocante e arroz de couve',
  4800,
  '/FILÉ GRELHADO COM ALHO, FAROFA E ARROZ DE COUVE.jpeg',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'pratos-principais'),
  'Costela Bovina Desfiada com Purê Cremoso',
  'Costela bovina desfiada ao molho especial com purê cremoso',
  3900,
  '/Costela Bovina Desfiada com Purê Cremoso.jpg',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'pratos-principais'),
  'Cupim Assado com Arroz Temperado',
  'Cupim assado lentamente até ficar macio, servido com arroz temperado',
  4300,
  '/Cupim Assado com Arroz Temperado.avif',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'pratos-principais'),
  'Frango Grelhado com Molho Chimichurri',
  'Peito de frango grelhado com molho chimichurri argentino',
  3200,
  '/Frango Grelhado com Molho Chimichurri.jpeg',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'pratos-principais'),
  'Frango Crocante com Molho Barbecue',
  'Frango empanado crocante servido com molho barbecue',
  3100,
  '/Frango Crocante com Molho Barbecue.webp',
  true
);

-- Insert products (Porções)
INSERT INTO products (category_id, name, description, price_in_cents, image_url, available) VALUES
(
  (SELECT id FROM categories WHERE slug = 'porcoes'),
  'Costelinha Suína ao Barbecue da Casa',
  'Porção generosa de costela suína ao molho barbecue especial',
  3800,
  '/Costelinha Suína ao Barbecue da Casa.webp',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'porcoes'),
  'Porção de Batata Rústica com Ervas e Alho',
  'Batatas rústicas assadas com ervas aromáticas e alho',
  1800,
  '/Porção de Batata Rústica com Ervas e Alho.jpeg',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'porcoes'),
  'Linguiça Artesanal com Pão de Alho e Vinagrete',
  'Linguiça artesanal grelhada servida com pão de alho e vinagrete',
  2500,
  '/Linguiça Artesanal com Pão de Alho e Vinagrete.jpg',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'porcoes'),
  'Mandioca Cozida e Frita com Manteiga e Páprica',
  'Mandioca sequinha frita com manteiga de ervas e páprica defumada',
  1600,
  '/Mandioca Cozida e Frita com Manteiga e Páprica.jpg',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'porcoes'),
  'Mix Brasa e Lenha',
  'Porção completa com fraldinha, linguiça, frango e batata rústica',
  5500,
  '/Mix Brasa e Lenha (fraldinha, linguiça, frango e batata rústica).jpeg',
  true
);

-- Insert products (Sanduíches)
INSERT INTO products (category_id, name, description, price_in_cents, image_url, available) VALUES
(
  (SELECT id FROM categories WHERE slug = 'sanduiches'),
  'Burger Brasa Clássico',
  'Hambúrguer artesanal com queijo, bacon e molho especial da casa',
  2800,
  '/Burger Brasa Clássico (com queijo, bacon e molho da casa).webp',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'sanduiches'),
  'Brisket Burger',
  'Hambúrguer de peito bovino defumado com cebola caramelizada',
  3200,
  '/Brisket Burger (hambúrguer de peito bovino defumado).jpeg',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'sanduiches'),
  'Sanduíche de Costela com Maionese Defumada',
  'Costela desfiada com maionese defumada em pão artesanal',
  2900,
  '/Sanduíche de Costela com Maionese Defumada.webp',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'sanduiches'),
  'Sanduíche de Frango Crocante com Molho Especial',
  'Frango empanado crocante com molho especial e salada',
  2600,
  '/Sanduíche de Frango Crocante com Molho Especial.webp',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'sanduiches'),
  'Sanduíche de Linguiça Artesanal com Queijo Derretido',
  'Linguiça artesanal com queijo derretido e cebola caramelizada',
  2400,
  '/Sanduíche de Linguiça Artesanal com Queijo derretido.jpg',
  true
);

-- Insert products (Bebidas)
INSERT INTO products (category_id, name, description, price_in_cents, image_url, available) VALUES
(
  (SELECT id FROM categories WHERE slug = 'bebidas'),
  'Refrigerante Lata Coca-Cola',
  'Coca-Cola lata 350ml gelada',
  500,
  '/Refrigerante lata (Coca-Cola).webp',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'bebidas'),
  'Refrigerante Lata Fanta',
  'Fanta lata 350ml gelada',
  500,
  '/Refrigerante lata (Fanta).webp',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'bebidas'),
  'Refrigerante Lata Guaraná',
  'Guaraná lata 350ml gelado',
  500,
  '/Refrigerante lata (Guaraná).webp',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'bebidas'),
  'Refrigerante Lata Limão',
  'Refrigerante de limão lata 350ml gelado',
  500,
  '/Refrigerante lata (refrigerante de limão).jpg',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'bebidas'),
  'Suco de Laranja Natural',
  'Suco de laranja natural feito na hora',
  800,
  '/Suco de laranja natural.webp',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'bebidas'),
  'Suco de Maracujá Fresco',
  'Suco de maracujá natural refrescante',
  800,
  '/Suco de maracujá fresco.jpg',
  true
),
(
  (SELECT id FROM categories WHERE slug = 'bebidas'),
  'Suco Natural de Abacaxi com Hortelã',
  'Suco natural de abacaxi com toque de hortelã',
  900,
  '/Suco natural de abacaxi com hortelã.jpg',
  true
);
