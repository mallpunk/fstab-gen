const fs = require('fs');
const path = require('path');

// Load the HTML file
const htmlPath = path.join(__dirname, '../index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Set up the DOM environment
document.documentElement.innerHTML = htmlContent;

// Mock alert function for testing
window.alert = jest.fn();

// Extract the script content more reliably
const scriptStart = htmlContent.indexOf('<script type="text/javascript">');
const scriptEnd = htmlContent.indexOf('</script>', scriptStart);
const scriptContent = htmlContent.substring(scriptStart + 31, scriptEnd);

// Execute the script in the global scope
eval(scriptContent);

// Make makeFstab available globally (works with both strict and non-strict mode)
global.makeFstab = window.makeFstab || makeFstab;

// Helper function to create a mock form with specific values
global.createMockForm = (values = {}) => {
  const form = document.createElement('form');
  form.name = 'fstabdata';
  
  // Create form elements based on the values
  const elements = {
    device: { type: 'text', value: values.device || '' },
    mountpoint: { type: 'text', value: values.mountpoint || '' },
    automount: { type: 'checkbox', checked: values.automount !== false },
    usermount: { type: 'checkbox', checked: values.usermount || false },
    exec: { type: 'checkbox', checked: values.exec !== false },
    writable: { type: 'checkbox', checked: values.writable !== false },
    sync: { type: 'checkbox', checked: values.sync || false },
    atime: { type: 'checkbox', checked: values.atime !== false },
    dump: { type: 'text', value: values.dump || '0' },
    fsck: { type: 'text', value: values.fsck || '0' },
    iocharset: { type: 'text', value: values.iocharset || '' },
    user: { type: 'text', value: values.user || '' },
    pass: { type: 'text', value: values.pass || '' },
    uid: { type: 'text', value: values.uid || '' },
    gid: { type: 'text', value: values.gid || '' },
    umask: { type: 'text', value: values.umask || '' },
    zfsutil: { type: 'checkbox', checked: values.zfsutil || false },
    size: { type: 'text', value: values.size || '' },
    output: { type: 'text', value: '' }
  };
  
  Object.entries(elements).forEach(([name, config]) => {
    const element = document.createElement('input');
    element.name = name;
    element.type = config.type;
    if (config.type === 'checkbox') {
      element.checked = config.checked;
    } else {
      element.value = config.value;
    }
    form.appendChild(element);
  });
  
  // Create filesystem select element
  const filesystemSelect = document.createElement('select');
  filesystemSelect.name = 'filesystem';
  
  // Create an option element for the filesystem value
  const option = document.createElement('option');
  option.value = values.filesystem || 'auto';
  option.text = values.filesystem || 'auto';
  option.selected = true;
  filesystemSelect.appendChild(option);
  
  form.appendChild(filesystemSelect);
  
  // Add the form to the document
  document.body.appendChild(form);
  
  // Make the form accessible via document.fstabdata
  document.fstabdata = form;
  
  // Also expose form elements as properties of document.fstabdata
  Object.entries(elements).forEach(([name, config]) => {
    document.fstabdata[name] = form.elements[name];
  });
  document.fstabdata.filesystem = form.elements.filesystem;
  
  return form;
};

// Helper function to get the output value
global.getOutputValue = () => {
  const form = document.fstabdata;
  return form ? form.output.value : '';
}; 