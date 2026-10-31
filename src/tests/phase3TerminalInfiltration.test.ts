import { describe, it, expect } from 'vitest';
import { SERVER_NODES } from '../data/worldData';

describe('Phase 3: Deeper Terminal & Server Infiltration', () => {
  it('assigns valid hierarchical folders to all files across all SERVER_NODES', () => {
    const nodes = Object.values(SERVER_NODES);
    expect(nodes.length).toBeGreaterThanOrEqual(11);

    for (const node of nodes) {
      expect(node.files.length).toBeGreaterThanOrEqual(2);
      const uniqueFolders = new Set<string>();
      for (const file of node.files) {
        expect(file.folder).toBeDefined();
        expect(file.folder?.startsWith('/')).toBe(true);
        uniqueFolders.add(file.folder!);
      }
      // Every server should span multiple directories (e.g. /etc, /opt/*, /var/*)
      expect(uniqueFolders.size).toBeGreaterThanOrEqual(2);
    }
  });

  it('includes running processes on every server and hostile sentinels on all trace-enabled nodes', () => {
    for (const node of Object.values(SERVER_NODES)) {
      expect(node.processes).toBeDefined();
      expect(node.processes!.length).toBeGreaterThanOrEqual(2);

      // Unique PIDs per server
      const pids = node.processes!.map(p => p.pid);
      expect(new Set(pids).size).toBe(pids.length);

      if (node.triggersTrace) {
        const sentinels = node.processes!.filter(p => p.isHostileSentinel);
        expect(sentinels.length).toBeGreaterThanOrEqual(1);
        for (const s of sentinels) {
          expect(s.traceReduction).toBeGreaterThan(0);
          expect(s.pid).toBeGreaterThan(100);
        }
      }
    }
  });

  it('ensures every encrypted archive has a matching providesKey file on the same server', () => {
    let totalEncryptedFiles = 0;
    for (const node of Object.values(SERVER_NODES)) {
      const providedKeys = new Set(
        node.files.map(f => f.providesKey).filter((k): k is string => Boolean(k))
      );

      const encryptedFiles = node.files.filter(f => Boolean(f.encryptionKey));
      totalEncryptedFiles += encryptedFiles.length;

      if (node.triggersTrace) {
        expect(encryptedFiles.length).toBeGreaterThanOrEqual(1);
      }

      for (const encFile of encryptedFiles) {
        expect(providedKeys.has(encFile.encryptionKey!)).toBe(true);
        expect(encFile.keyHint).toBeDefined();
        expect(encFile.keyHint!.length).toBeGreaterThan(5);
      }
    }
    expect(totalEncryptedFiles).toBeGreaterThanOrEqual(7);
  });

  it('places decryption key provider files in a separate config/log directory from the locked archive', () => {
    for (const node of Object.values(SERVER_NODES)) {
      for (const encFile of node.files.filter(f => Boolean(f.encryptionKey))) {
        const providerFile = node.files.find(f => f.providesKey === encFile.encryptionKey);
        expect(providerFile).toBeDefined();
        expect(providerFile!.name).not.toBe(encFile.name);
        expect(providerFile!.content).toContain(encFile.encryptionKey!);
      }
    }
  });
});
