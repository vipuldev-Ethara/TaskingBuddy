from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from apps.projects.models import Project
from apps.tasks.models import Task
from .models import ActivityLog
from .serializers import ActivityLogSerializer

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()
        
        # Base querysets depending on user role
        if user.role == 'admin':
            projects_qs = Project.objects.all()
            tasks_qs = Task.objects.all()
        else:
            projects_qs = Project.objects.filter(members=user)
            tasks_qs = Task.objects.filter(project__members=user)

        # Overview Stats
        total_projects = projects_qs.count()
        total_tasks = tasks_qs.count()
        completed_tasks = tasks_qs.filter(status='completed').count()
        overdue_tasks = tasks_qs.filter(
            due_date__lt=today, 
        ).exclude(status='completed').count()

        # Task breakdown by status
        tasks_by_status = tasks_qs.values('status').annotate(count=Count('id'))
        
        # Task breakdown by priority
        tasks_by_priority = tasks_qs.values('priority').annotate(count=Count('id'))

        # Productivity (completed tasks last 7 days)
        last_7_days = today - timedelta(days=7)
        recently_completed = tasks_qs.filter(
            status='completed',
            updated_at__gte=last_7_days
        ).count()

        data = {
            'overview': {
                'total_projects': total_projects,
                'total_tasks': total_tasks,
                'completed_tasks': completed_tasks,
                'overdue_tasks': overdue_tasks,
            },
            'tasks_by_status': list(tasks_by_status),
            'tasks_by_priority': list(tasks_by_priority),
            'productivity': {
                'recently_completed': recently_completed
            }
        }
        
        return Response(data)

class ActivityLogView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        if user.role == 'admin':
            logs = ActivityLog.objects.all()[:20]
        else:
            # Get logs for projects the user is a member of
            logs = ActivityLog.objects.filter(
                Q(project__members=user) | Q(user=user)
            ).distinct()[:20]
            
        serializer = ActivityLogSerializer(logs, many=True)
        return Response(serializer.data)
