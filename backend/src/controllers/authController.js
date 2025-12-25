exports.login = async (req, res) => {
  const { email, password, subdomain, tenantSubdomain } = req.body;
  const activeSubdomain = subdomain || tenantSubdomain;
  
  try {
    // FIXED: Use LOWER() for case-insensitive email matching
    const result = await pool.query(
      `SELECT u.*, t.status as tenant_status, t.subdomain 
       FROM users u 
       LEFT JOIN tenants t ON u.tenant_id = t.id 
       WHERE LOWER(u.email) = LOWER($1) AND (
         (u.tenant_id IS NOT NULL AND t.subdomain = $2) 
         OR (u.tenant_id IS NULL)
       )`,
      [email, activeSubdomain]
    );
    
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    if (!(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Rest of login logic...
    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenant_id, role: user.role },
      process.env.JWT_SECRET || 'dev_secret_key_minimum_32_chars_12345',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      data: {
        user: { 
          id: user.id, 
          email: user.email, 
          fullName: user.full_name, 
          role: user.role, 
          tenantId: user.tenant_id 
        },
        token,
        expiresIn: 86400
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
