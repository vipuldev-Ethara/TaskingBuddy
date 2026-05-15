from django.db import models
from django.contrib.auth import get_user_model
from apps.projects.models import Project
from apps.tasks.models import Task

User = get_user_model()

class ActivityLog(models.Model):
    ACTION_CHOICES = (
        ('created', 'Created'),
        ('updated', 'Updated'),
        ('deleted', 'Deleted'),
        ('assigned', 'Assigned'),
        ('status_changed', 'Status Changed'),
        ('commented', 'Commented'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_logs')
    action_type = models.CharField(max_length=20, choices=ACTION_CHOICES)
    description = models.TextField()
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True, related_name='activity_logs')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True, related_name='activity_logs')
    
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user} {self.action_type} - {self.timestamp}"
