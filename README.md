# R&D Dashboard

A modern, web-based dashboard for managing R&D projects with a beautiful gradient design and intuitive interface.

## Features

- **Project Management**: Create, edit, and organize R&D projects
- **Progress Tracking**: Visual progress bars and milestone tracking
- **Team Management**: Assign team members to projects
- **Large & Small Projects**: Organized sections for different project types
- **Beautiful UI**: Modern gradient design with hexagonal patterns
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Data Export**: Backup your projects as JSON files

## Pre-configured Large Projects

The dashboard comes with these 4 large projects pre-loaded:

1. **Thermal Dynamics** - Advanced thermal analysis and optimization research
2. **Structures** - Structural engineering and material science projects
3. **Industrial Maintenance** - Maintenance optimization and predictive analytics
4. **Eblocks 3** - Next generation electronic building blocks development

## Getting Started

1. **Clone or download** this repository
2. **Open `index.html`** in your web browser
3. **Start using** the dashboard immediately!

No installation or setup required - just open the HTML file in any modern web browser.

## Usage

### Adding New Projects
1. Click the "Add New Project" button
2. Fill out the project form with details
3. Select project type (Large or Small)
4. Set progress, dates, and team members
5. Click "Save Project"

### Viewing Projects
- **Large Projects** appear in the blue-tinted section
- **Small Projects** appear in the purple-tinted section
- Use filter buttons to view specific project types or statuses

### Project Details
- Click "View Details" on any project card to see full information
- Edit or delete projects using the action buttons

## Data Storage

Currently uses browser LocalStorage for data persistence. Your projects will be saved locally and persist between browser sessions.

### Future Plans
- Integration with shared database (JSONBin.io, Firebase, or Supabase)
- Real-time collaboration between team members
- Cloud-based data storage for team access

## Technology Stack

- **HTML5/CSS3/JavaScript** - Pure web technologies, no frameworks
- **CSS Gradients** - Modern visual design
- **LocalStorage** - Browser-based data persistence
- **Responsive Design** - Mobile-friendly interface

## Browser Support

Works in all modern web browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## File Structure

```
dev-dashboard/
├── index.html          # Main dashboard page
├── styles.css          # Stylesheet with gradient design
├── script.js           # Dashboard functionality
├── README.md           # This file
└── R&D_Dashboard_Plan.md # Development plan document
```

## Development

This dashboard is built with simplicity in mind - no complex frameworks or dependencies. All code is beginner-friendly and well-commented.

### Future Enhancements
- Shared database integration
- Real-time updates
- Advanced reporting
- Project templates
- Email notifications

## License

Open source - feel free to use and modify for your R&D needs.

## Support

For questions or issues, please refer to the development plan document or create an issue in the repository.
