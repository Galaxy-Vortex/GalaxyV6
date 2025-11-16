function launchBlob() { 
  const currentSiteUrl = window.location.href + "?redirect=true";

  const htmlContent = `
    <html>
      <head>
        <title>Galaxy</title>
        <style>
          body,
          html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          iframe {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe src="${currentSiteUrl}"></iframe>
      </body>
    </html>
	`;

  const blob = new Blob([htmlContent], {
    type: "text/html",
  });

  const blobUrl = URL.createObjectURL(blob);

  let newWindow = window.open(blobUrl);
  if (newWindow) {
    newWindow.onload = () => {
      newWindow.document.title = "Galaxy";
    };
  }
}
