from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Task

@receiver(post_save, sender=Task)
def send_task_assignment_email(sender, instance, created, **kwargs):
    if instance.assigned_to:
        subject = f"Task Assigned: {instance.title}"
        message = f"You have been assigned to a task '{instance.title}' in project '{instance.project.title}'.\n\nPriority: {instance.get_priority_display()}\nDue Date: {instance.due_date}"
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [instance.assigned_to.email]
        
        # Only send email if the assigned user's email is set
        if instance.assigned_to.email:
            try:
                send_mail(subject, message, from_email, recipient_list, fail_silently=True)
            except Exception as e:
                print(f"Error sending email: {e}")
