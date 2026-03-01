const fs = require('fs');
const file = 'c:/Users/Кирилл/Desktop/Проекты и сторонние сайты/CyberWhale Universe/CyberWhale Universe Design Concept (1)/src/app/components/Navigation.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ useState \} from 'react';/, "import { useState, useEffect } from 'react';");

content = content.replace(/const \[token, setToken\] = useState<string \| null>\(null\);[\s\S]*?const location = useLocation\(\);/, `const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserName(localStorage.getItem('userName'));
  }, []);

  const location = useLocation();`);

content = content.replace(/\{\/\* Auth Button \*\/\}[\s\S]*?<\/Link>/, `{/* Auth Button */}
          {token ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                setToken(null);
                window.location.href = '/';
              }}
              className="px-6 py-2 rounded-lg bg-card border border-border text-foreground font-medium hover:bg-card/80 transition-all text-sm"
            >
              Выйти ({userName || 'User'})
            </motion.button>
          ) : (
            <Link to="/auth">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(159, 239, 0, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all text-sm"
              >
                Войти
              </motion.button>
            </Link>
          )}`);

fs.writeFileSync(file, content);
console.log('Done modifying Navigation.tsx');
