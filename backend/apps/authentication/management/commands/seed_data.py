import random
from datetime import timedelta
from django.utils import timezone
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.projects.models import Project
from apps.tasks.models import Task
from apps.dashboard.models import ActivityLog

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with sample data for demonstration purposes.'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Create Admin
        admin, created = User.objects.get_or_create(
            username='admin',
            email='admin@example.com',
            defaults={
                'role': 'admin',
                'first_name': 'Admin',
                'last_name': 'User',
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write('Created admin user: admin@example.com / admin123')

        # Create Members
        members = []
        for i in range(1, 6):
            member, created = User.objects.get_or_create(
                username=f'member{i}',
                email=f'member{i}@example.com',
                defaults={
                    'role': 'member',
                    'first_name': f'Member',
                    'last_name': f'{i}',
                }
            )
            if created:
                member.set_password('member123')
                member.save()
            members.append(member)

        if not Project.objects.exists():
            # Create Projects
            projects_data = [
                {'title': 'Website Redesign', 'description': 'Revamp the corporate website with a modern look.'},
                {'title': 'Mobile App V2', 'description': 'Develop the second version of our iOS and Android apps.'},
                {'title': 'Q3 Marketing Campaign', 'description': 'Plan and execute the marketing strategy for Q3.'},
                {'title': 'Database Migration', 'description': 'Migrate data from legacy systems to the new cloud infrastructure.'},
            ]

            for i, p_data in enumerate(projects_data):
                project = Project.objects.create(
                    title=p_data['title'],
                    description=p_data['description'],
                    deadline=timezone.now().date() + timedelta(days=random.randint(10, 60)),
                    status=random.choice(['active', 'active', 'active', 'completed']),
                    created_by=admin
                )
                
                # Assign 2-4 random members
                assigned_members = random.sample(members, random.randint(2, 4))
                project.members.set(assigned_members)
                
                # Create Activity Log
                ActivityLog.objects.create(
                    user=admin,
                    action_type='created',
                    description=f"Created project '{project.title}'",
                    project=project
                )

                # Create Tasks for each project
                for j in range(random.randint(4, 10)):
                    assigned_to = random.choice(assigned_members)
                    status = random.choice(['todo', 'in_progress', 'completed'])
                    due_date = timezone.now().date() + timedelta(days=random.randint(-5, 15))
                    
                    task = Task.objects.create(
                        title=f'Task {j+1} for {project.title}',
                        description='This is a randomly generated task description for testing purposes.',
                        priority=random.choice(['low', 'medium', 'medium', 'high']),
                        status=status,
                        due_date=due_date,
                        project=project,
                        assigned_to=assigned_to,
                        created_by=admin
                    )

                    ActivityLog.objects.create(
                        user=admin,
                        action_type='created',
                        description=f"Created task '{task.title}'",
                        project=project,
                        task=task
                    )
                    
                    if status == 'completed':
                        ActivityLog.objects.create(
                            user=assigned_to,
                            action_type='status_changed',
                            description=f"Marked task '{task.title}' as completed",
                            project=project,
                            task=task
                        )

            self.stdout.write(self.style.SUCCESS('Successfully seeded database with projects and tasks.'))
        else:
            self.stdout.write('Database already contains projects, skipping seed.')
