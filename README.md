# fstab line generator

A simple web UI to generate configuration lines for `/etc/fstab`. This tool helps create properly formatted fstab entries with the correct syntax and options.

## Features

- **Self-contained**: Single HTML file with embedded CSS and JavaScript
- **Multiple filesystem support**: ext2, ext3, ext4, cifs, nfs, smbfs, vfat, ntfs, reiserfs, sshfs, zfs, xfs, tmpfs
- **Configurable options**: Auto mount, user mount, executable, writable, sync, atime
- **Additional parameters**: iocharset, username, password, uid, gid, umask support
- **Filesystem-specific options**: zfsutil for ZFS, size for tmpfs
- **Proper formatting**: Generates tab-separated fstab lines with correct field order

## Usage

1. Open `index.html` in any modern web browser
2. Fill in the device, mount point, and filesystem information
3. Configure the mount options using the checkboxes
4. Add any additional parameters (charset, username, password) if needed
5. Click "Generate fstab line" to get the formatted output
6. Copy the generated line to your `/etc/fstab` file

## Development

### Running Tests

This project includes comprehensive unit tests for the JavaScript functionality:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The tests cover:
- Basic fstab line generation with default values
- All checkbox combinations (checked/unchecked states)
- Optional parameters (iocharset, user, pass)
- Different filesystem types
- Edge cases (empty values, missing form elements)
- Output format validation (tab separators, field order)

### Project Structure

```
fstab/
├── index.html          # Main application (self-contained)
├── package.json        # Node.js dependencies and scripts
├── tests/
│   ├── setup.js        # Jest setup and test utilities
│   └── fstab.test.js   # Unit tests for makeFstab function
└── README.md          # This file
```

## Original Code

This is based on original code from 2010. The JavaScript uses patterns from that era but has been thoroughly tested to ensure functionality.

## License

MIT License - see LICENSE file for details. 