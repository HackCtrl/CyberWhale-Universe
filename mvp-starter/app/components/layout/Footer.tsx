import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Cyber<span className="text-green-500">Whale</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Платформа для обучения кибербезопасности и проведения CTF соревнований.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="text-gray-400 hover:text-white">Обучение</Link></li>
              <li><Link href="/ctf" className="text-gray-400 hover:text-white">CTF Соревнования</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Профиль</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-gray-400 hover:text-white">Войти</Link></li>
              <li><Link href="/register" className="text-gray-400 hover:text-white">Регистрация</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex justify-between items-center">
          <p className="text-gray-500 text-sm">© 2026 CyberWhale. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
