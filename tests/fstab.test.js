describe('fstab line generator', () => {
  beforeEach(() => {
    // Clean up any existing forms
    const existingForm = document.querySelector('form[name="fstabdata"]');
    if (existingForm) {
      existingForm.remove();
    }
  });

  afterEach(() => {
    // Clean up after each test
    const existingForm = document.querySelector('form[name="fstabdata"]');
    if (existingForm) {
      existingForm.remove();
    }
  });

  describe('makeFstab function', () => {
    test('should generate basic fstab line with default values', () => {
      createMockForm({
        device: '/dev/sda1',
        mountpoint: '/mnt/data',
        filesystem: 'ext4'
      });

      makeFstab();
      const output = getOutputValue();

      expect(output).toBe('/dev/sda1\t/mnt/data\text4\tauto,nouser,exec,rw,async,atime\t0 0');
    });

    test('should handle all checkboxes unchecked', () => {
      createMockForm({
        device: '/dev/sdb1',
        mountpoint: '/home',
        filesystem: 'ext3',
        automount: false,
        usermount: false,
        exec: false,
        writable: false,
        sync: false,
        atime: false
      });

      makeFstab();
      const output = getOutputValue();

      expect(output).toBe('/dev/sdb1\t/home\text3\tnoauto,nouser,noexec,ro,async,noatime\t0 0');
    });

    test('should handle all checkboxes checked', () => {
      createMockForm({
        device: '/dev/sdc1',
        mountpoint: '/var',
        filesystem: 'ext2',
        automount: true,
        usermount: true,
        exec: true,
        writable: true,
        sync: true,
        atime: true
      });

      makeFstab();
      const output = getOutputValue();

      expect(output).toBe('/dev/sdc1\t/var\text2\tauto,user,exec,rw,sync,atime\t0 0');
    });

    test('should include iocharset when provided', () => {
      createMockForm({
        device: '/dev/sdd1',
        mountpoint: '/mnt/windows',
        filesystem: 'vfat',
        iocharset: 'utf8'
      });

      makeFstab();
      const output = getOutputValue();

      expect(output).toBe('/dev/sdd1\t/mnt/windows\tvfat\tiocharset=utf8,auto,nouser,exec,rw,async,atime\t0 0');
    });

    test('should include user and pass when provided', () => {
      createMockForm({
        device: '//server/share',
        mountpoint: '/mnt/network',
        filesystem: 'cifs',
        user: 'username',
        pass: 'password'
      });

      makeFstab();
      const output = getOutputValue();

      expect(output).toBe('//server/share\t/mnt/network\tcifs\tuser=username,pass=password,auto,nouser,exec,rw,async,atime\t0 0');
    });

    test('should include all optional parameters when provided', () => {
      createMockForm({
        device: '//server/share',
        mountpoint: '/mnt/network',
        filesystem: 'cifs',
        iocharset: 'utf8',
        user: 'username',
        pass: 'password'
      });

      makeFstab();
      const output = getOutputValue();

      expect(output).toBe('//server/share\t/mnt/network\tcifs\tiocharset=utf8,user=username,pass=password,auto,nouser,exec,rw,async,atime\t0 0');
    });

    test('should handle custom dump and fsck values', () => {
      createMockForm({
        device: '/dev/sde1',
        mountpoint: '/backup',
        filesystem: 'ext4',
        dump: '1',
        fsck: '2'
      });

      makeFstab();
      const output = getOutputValue();

      expect(output).toBe('/dev/sde1\t/backup\text4\tauto,nouser,exec,rw,async,atime\t1 2');
    });

    test('should handle empty device and mountpoint', () => {
      createMockForm({
        device: '',
        mountpoint: '',
        filesystem: 'auto'
      });

      makeFstab();
      const output = getOutputValue();

      expect(output).toBe('\t\tauto\tauto,nouser,exec,rw,async,atime\t0 0');
    });

    test('should handle NFS filesystem', () => {
      createMockForm({
        device: '192.168.1.100:/shared',
        mountpoint: '/mnt/nfs',
        filesystem: 'nfs'
      });

      makeFstab();
      const output = getOutputValue();

      expect(output).toBe('192.168.1.100:/shared\t/mnt/nfs\tnfs\tauto,nouser,exec,rw,async,atime\t0 0');
    });

    test('should handle SSHFS filesystem', () => {
      createMockForm({
        device: '//server/share',
        mountpoint: '/mnt/ssh',
        filesystem: 'sshfs'
      });

      makeFstab();
      const output = getOutputValue();

      expect(output).toBe('//server/share\t/mnt/ssh\tsshfs\tauto,nouser,exec,rw,async,atime\t0 0');
    });
  });

  describe('form validation', () => {
    test('should handle missing form elements gracefully', () => {
      // Create a minimal form without all elements
      const form = document.createElement('form');
      form.name = 'fstabdata';
      
      const deviceInput = document.createElement('input');
      deviceInput.name = 'device';
      deviceInput.value = '/dev/test';
      form.appendChild(deviceInput);
      
      const outputInput = document.createElement('input');
      outputInput.name = 'output';
      outputInput.value = '';
      form.appendChild(outputInput);
      
      document.body.appendChild(form);

      // This should not throw an error
      expect(() => makeFstab()).not.toThrow();
    });
  });

  describe('output format validation', () => {
    test('should generate output with correct tab separators', () => {
      createMockForm({
        device: '/dev/sda1',
        mountpoint: '/mnt/data',
        filesystem: 'ext4'
      });

      makeFstab();
      const output = getOutputValue();

      // Should have exactly 5 tab-separated fields (dump and fsck are space-separated in the last field)
      const fields = output.split('\t');
      expect(fields).toHaveLength(5);
    });

    test('should have correct field order', () => {
      createMockForm({
        device: '/dev/sda1',
        mountpoint: '/mnt/data',
        filesystem: 'ext4'
      });

      makeFstab();
      const output = getOutputValue();
      const fields = output.split('\t');

      // Field order: device, mountpoint, filesystem, options, dump fsck (space-separated)
      expect(fields[0]).toBe('/dev/sda1');      // device
      expect(fields[1]).toBe('/mnt/data');      // mountpoint
      expect(fields[2]).toBe('ext4');           // filesystem
      expect(fields[3]).toContain('auto');      // options
      expect(fields[4]).toBe('0 0');            // dump and fsck (space-separated)
    });
  });
}); 