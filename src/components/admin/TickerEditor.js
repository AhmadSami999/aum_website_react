// src/components/admin/TickerEditor.js

import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

function TickerEditor() {
  const [text, setText] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'ticker'));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setText(data.text || '');
        setEnabled(data.enabled ?? false);
      }
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    await setDoc(doc(db, 'settings', 'ticker'), {
      text,
      enabled,
    });
    setSaving(false);
  };

  return (
    <div className="home-editor">
      <h2>Edit Ticker</h2>

      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => setEnabled(e.target.checked)}
          style={{ marginRight: '0.5rem' }}
        />
        Enable ticker
      </label>

      <textarea
        rows="3"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter ticker text here…"
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        disabled={!enabled}
      />

      <button onClick={save} disabled={saving}>
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  );
}

export default TickerEditor;
