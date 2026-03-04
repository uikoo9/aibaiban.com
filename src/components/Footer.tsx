import { theme } from 'antd'

const projects = [
  { domain: 'webcc.dev', desc: 'Web Claude Code', link: 'https://www.webcc.dev/' },
  { domain: 'viho.fun', desc: 'AI CLI Tool', link: 'https://www.viho.fun/' },
  { domain: 'remotion.cool', desc: 'Video Creation', link: 'https://www.remotion.cool/' },
  { domain: 'mcp-servers.online', desc: 'MCP Server Collection', link: 'https://mcp-servers.online/' },
  { domain: 'aibaiban.com', desc: 'AI Whiteboard', link: 'https://aibaiban.com/' },
  { domain: 'aitubiao.online', desc: 'AI Chart Generator', link: 'https://aitubiao.online/' },
]

const openSource = [
  { name: 'qiao-z', desc: 'Node.js Web Framework', link: 'https://qiao-z.vincentqiao.com/#/' },
  { name: 'qiao-ui', desc: 'React UI Library', link: 'https://qiao-ui.vincentqiao.com/#/' },
  { name: 'qiao-webpack', desc: 'Webpack Scaffolding', link: 'https://qiao-webpack.vincentqiao.com/#/' },
  { name: 'qiao-project', desc: 'Monorepo Tooling', link: 'https://qiao-project.vincentqiao.com/#/' },
  { name: 'qiao-electron-cli', desc: 'Electron Packaging CLI', link: 'https://qiao-electron-cli.vincentqiao.com/#/' },
]

const linkStyle = (colorTextSecondary: string): React.CSSProperties => ({
  fontSize: 14,
  color: colorTextSecondary,
  textDecoration: 'none',
  transition: 'color 0.2s',
})

export function Footer() {
  const { token } = theme.useToken()

  return (
    <>
      <footer
        style={{
          borderTop: `1px solid ${token.colorBorder}`,
          padding: '48px 24px',
          background: token.colorBgContainer,
        }}
      >
        <div
          style={{
            maxWidth: 1152,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
          }}
        >
          {/* Column 1: Projects */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: token.colorPrimary, marginBottom: 4 }}>Projects</h4>
            {projects.map((item) => (
              <a
                key={item.domain}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle(token.colorTextSecondary)}
                onMouseEnter={(e) => (e.currentTarget.style.color = token.colorPrimary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = token.colorTextSecondary)}
              >
                {item.domain} - {item.desc}
              </a>
            ))}
          </div>

          {/* Column 2: Open Source */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: token.colorPrimary, marginBottom: 4 }}>Open Source</h4>
            {openSource.map((item) => (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle(token.colorTextSecondary)}
                onMouseEnter={(e) => (e.currentTarget.style.color = token.colorPrimary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = token.colorTextSecondary)}
              >
                {item.name} - {item.desc}
              </a>
            ))}
            <a
              href="https://code.vincentqiao.com/#/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, color: token.colorPrimary, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              More 50+ npm packages →
            </a>
          </div>

          {/* Column 3: Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: token.colorPrimary, marginBottom: 4 }}>Contact</h4>
            <a
              href="https://github.com/uikoo9"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle(token.colorTextSecondary)}
              onMouseEnter={(e) => (e.currentTarget.style.color = token.colorPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = token.colorTextSecondary)}
            >
              GitHub
            </a>
            <a
              href="mailto:hello@vincentqiao.com"
              style={linkStyle(token.colorTextSecondary)}
              onMouseEnter={(e) => (e.currentTarget.style.color = token.colorPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = token.colorTextSecondary)}
            >
              hello@vincentqiao.com
            </a>
          </div>
        </div>
      </footer>

      {/* Sub Footer */}
      <div
        style={{
          borderTop: `1px solid ${token.colorBorder}`,
          padding: 24,
          textAlign: 'center' as const,
          background: token.colorBgContainer,
        }}
      >
        <span style={{ fontSize: 12, color: token.colorTextTertiary }}>© 2026 Vincent. All rights reserved.</span>
      </div>
    </>
  )
}
