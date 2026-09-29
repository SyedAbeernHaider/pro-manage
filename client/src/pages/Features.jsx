import { useEffect } from 'react';
import { ChartColumn, FolderKanban, SquareKanban, Users } from 'lucide-react';
import AppBoardMockup from '../components/features/AppBoardMockup';
import CollaborationMockup from '../components/features/CollaborationMockup';
import FeatureRow from '../components/features/FeatureRow';
import FeaturesCta from '../components/features/FeaturesCta';
import FeaturesHero from '../components/features/FeaturesHero';
import MoreFeaturesGrid from '../components/features/MoreFeaturesGrid';
import ProjectsMockup from '../components/features/ProjectsMockup';
import ReportsMockup from '../components/features/ReportsMockup';
import Footer from '../components/home/Footer';

const Features = () => {
  useEffect(() => {
    document.title = 'Features — Kanbrix';
  }, []);

  return (
    <>
      <main>
        <FeaturesHero />

        <FeatureRow
          id="projects"
          icon={FolderKanban}
          label="Project Management"
          title="Keep your projects on track"
          description="Create projects, set goals and break work into manageable tasks. See at a glance what’s happening, who’s working on what, and what’s next — all in one place."
          bullets={[
            'Create and manage multiple projects',
            'Set milestones and deadlines',
            'Track progress in real time',
          ]}
          visual={<ProjectsMockup />}
        />

        <div className="bg-zinc-50/70">
          <FeatureRow
            id="kanban"
            icon={SquareKanban}
            label="Kanban Board"
            title="Visualize. Prioritize. Deliver."
            description="An intuitive Kanban board helps your team stay organized, see the bigger picture and move work forward — without the chaos."
            bullets={[
              'Drag & drop workflow',
              'Customizable columns and statuses',
              'Quick task creation',
            ]}
            visual={<AppBoardMockup interactive compact />}
            reverse
          />
        </div>

        <FeatureRow
          id="collaboration"
          icon={Users}
          label="Team Collaboration"
          title="Work better, together"
          description="Keep your team in sync with real-time updates, comments, mentions and notifications — no matter where everyone is."
          bullets={[
            'Real-time comments & threads',
            'Mention teammates with @username',
            'Activity feed & notifications',
          ]}
          visual={<CollaborationMockup />}
        />

        <div className="bg-zinc-50/70">
          <FeatureRow
            id="reports"
            icon={ChartColumn}
            label="Reports & Analytics"
            title="Know exactly where every sprint stands"
            description="Live dashboards turn your team’s work into clear insights, so you can spot blockers early and plan the next sprint with confidence."
            bullets={[
              'Sprint progress & burndown',
              'Completion and cycle-time metrics',
              'Workload by teammate',
            ]}
            visual={<ReportsMockup />}
            reverse
          />
        </div>

        <MoreFeaturesGrid />
        <FeaturesCta />
      </main>
      <Footer />
    </>
  );
};

export default Features;
