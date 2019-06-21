export default ({
  body,
  title,
  initialState,
  icon,
}) => `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <link rel="stylesheet" type="text/css" href="/assets/styles.css">
        <link rel="shortcut icon" href="${icon}">
      </head>

      <body>
        <div id="root">${body}</div>
      </body>

      <script src="/bundle.js"></script>
    </html>
  `;
