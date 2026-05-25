'use client';
import { useEffect } from 'react';

export default function Smartsupp() {
  useEffect(() => {
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = '6344c78da45213b07d5767dd645eae013b91595a';

    window.smartsupp = window.smartsupp || function () {
      window.smartsupp._.push(arguments);
    };
    window.smartsupp._ = window.smartsupp._ || [];

    const s = document.getElementsByTagName('script')[0];
    const c = document.createElement('script');
    c.type = 'text/javascript';
    c.charset = 'utf-8';
    c.async = true;
    c.src = 'https://www.smartsuppchat.com/loader.js?';
    s.parentNode.insertBefore(c, s);
  }, []);

  return null;
}
