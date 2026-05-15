import django_filters
from django.utils import timezone
from .models import Task

class TaskFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.ChoiceFilter(choices=Task.STATUS_CHOICES)
    priority = django_filters.ChoiceFilter(choices=Task.PRIORITY_CHOICES)
    project = django_filters.NumberFilter(field_name='project__id')
    assigned_to = django_filters.NumberFilter(field_name='assigned_to__id')
    is_overdue = django_filters.BooleanFilter(method='filter_overdue')

    class Meta:
        model = Task
        fields = ['status', 'priority', 'project', 'assigned_to', 'title']

    def filter_overdue(self, queryset, name, value):
        if value:
            return queryset.filter(
                due_date__lt=timezone.now().date()
            ).exclude(status='completed')
        return queryset
