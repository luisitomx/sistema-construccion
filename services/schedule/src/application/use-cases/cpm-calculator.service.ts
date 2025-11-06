import { Injectable, Logger } from '@nestjs/common';
import { Activity } from '../../domain/entities/activity.entity';
import { Dependency, DependencyType } from '../../domain/entities/dependency.entity';

export interface CPMResult {
  activities: Activity[];
  criticalPath: string[];
  totalDuration: number;
}

@Injectable()
export class CPMCalculator {
  private readonly logger = new Logger(CPMCalculator.name);

  /**
   * Calculate Critical Path Method for a set of activities
   */
  calculate(activities: Activity[], dependencies: Dependency[]): CPMResult {
    this.logger.log(`Calculating CPM for ${activities.length} activities`);

    // Reset all CPM fields
    this.resetActivities(activities);

    // Build adjacency lists
    const predecessorsMap = this.buildPredecessorsMap(activities, dependencies);
    const successorsMap = this.buildSuccessorsMap(activities, dependencies);

    // Forward pass: calculate ES and EF
    this.forwardPass(activities, predecessorsMap, dependencies);

    // Backward pass: calculate LS and LF
    const projectDuration = this.backwardPass(activities, successorsMap, dependencies);

    // Calculate float and identify critical activities
    this.calculateFloat(activities);

    // Find critical path
    const criticalPath = this.findCriticalPath(activities, dependencies);

    this.logger.log(`CPM calculation complete. Project duration: ${projectDuration} days`);
    this.logger.log(`Critical path: ${criticalPath.join(' -> ')}`);

    return {
      activities,
      criticalPath,
      totalDuration: projectDuration,
    };
  }

  private resetActivities(activities: Activity[]): void {
    for (const activity of activities) {
      activity.earlyStart = 0;
      activity.earlyFinish = 0;
      activity.lateStart = 0;
      activity.lateFinish = 0;
      activity.totalFloat = 0;
      activity.freeFloat = 0;
      activity.isCritical = false;
    }
  }

  private buildPredecessorsMap(
    activities: Activity[],
    dependencies: Dependency[]
  ): Map<string, Dependency[]> {
    const map = new Map<string, Dependency[]>();

    for (const activity of activities) {
      map.set(activity.id, []);
    }

    for (const dep of dependencies) {
      const predecessors = map.get(dep.successorId) || [];
      predecessors.push(dep);
      map.set(dep.successorId, predecessors);
    }

    return map;
  }

  private buildSuccessorsMap(
    activities: Activity[],
    dependencies: Dependency[]
  ): Map<string, Dependency[]> {
    const map = new Map<string, Dependency[]>();

    for (const activity of activities) {
      map.set(activity.id, []);
    }

    for (const dep of dependencies) {
      const successors = map.get(dep.predecessorId) || [];
      successors.push(dep);
      map.set(dep.predecessorId, successors);
    }

    return map;
  }

  /**
   * Forward pass: Calculate Early Start and Early Finish
   */
  private forwardPass(
    activities: Activity[],
    predecessorsMap: Map<string, Dependency[]>,
    dependencies: Dependency[]
  ): void {
    // Topological sort to process activities in order
    const sorted = this.topologicalSort(activities, dependencies);

    for (const activity of sorted) {
      const predecessors = predecessorsMap.get(activity.id) || [];

      if (predecessors.length === 0) {
        // Start activity
        activity.earlyStart = 0;
      } else {
        // ES = max(predecessor EF + lag) for all predecessors
        let maxES = 0;
        for (const dep of predecessors) {
          const pred = activities.find(a => a.id === dep.predecessorId)!;
          const es = this.calculateEarlyStart(pred, dep);
          maxES = Math.max(maxES, es);
        }
        activity.earlyStart = maxES;
      }

      activity.earlyFinish = activity.earlyStart + activity.duration;
    }
  }

  private calculateEarlyStart(predecessor: Activity, dependency: Dependency): number {
    switch (dependency.type) {
      case DependencyType.FINISH_TO_START:
        return predecessor.earlyFinish + dependency.lag;
      case DependencyType.START_TO_START:
        return predecessor.earlyStart + dependency.lag;
      case DependencyType.FINISH_TO_FINISH:
        return predecessor.earlyFinish + dependency.lag;
      case DependencyType.START_TO_FINISH:
        return predecessor.earlyStart + dependency.lag;
      default:
        return predecessor.earlyFinish + dependency.lag;
    }
  }

  /**
   * Backward pass: Calculate Late Start and Late Finish
   */
  private backwardPass(
    activities: Activity[],
    successorsMap: Map<string, Dependency[]>,
    dependencies: Dependency[]
  ): number {
    // Find project duration (max EF)
    const projectDuration = Math.max(...activities.map(a => a.earlyFinish));

    // Reverse topological sort
    const sorted = this.topologicalSort(activities, dependencies).reverse();

    for (const activity of sorted) {
      const successors = successorsMap.get(activity.id) || [];

      if (successors.length === 0) {
        // End activity
        activity.lateFinish = projectDuration;
      } else {
        // LF = min(successor LS - lag) for all successors
        let minLF = Infinity;
        for (const dep of successors) {
          const succ = activities.find(a => a.id === dep.successorId)!;
          const lf = this.calculateLateFinish(succ, dep);
          minLF = Math.min(minLF, lf);
        }
        activity.lateFinish = minLF;
      }

      activity.lateStart = activity.lateFinish - activity.duration;
    }

    return projectDuration;
  }

  private calculateLateFinish(successor: Activity, dependency: Dependency): number {
    switch (dependency.type) {
      case DependencyType.FINISH_TO_START:
        return successor.lateStart - dependency.lag;
      case DependencyType.START_TO_START:
        return successor.lateStart - dependency.lag;
      case DependencyType.FINISH_TO_FINISH:
        return successor.lateFinish - dependency.lag;
      case DependencyType.START_TO_FINISH:
        return successor.lateFinish - dependency.lag;
      default:
        return successor.lateStart - dependency.lag;
    }
  }

  /**
   * Calculate Total Float and Free Float
   */
  private calculateFloat(activities: Activity[]): void {
    for (const activity of activities) {
      // Total Float = LS - ES or LF - EF
      activity.totalFloat = activity.lateStart - activity.earlyStart;

      // Activity is critical if Total Float = 0
      activity.isCritical = activity.totalFloat === 0;
    }
  }

  /**
   * Find the critical path
   */
  private findCriticalPath(activities: Activity[], dependencies: Dependency[]): string[] {
    const criticalActivities = activities.filter(a => a.isCritical);

    // Build path by following dependencies
    const path: string[] = [];
    const visited = new Set<string>();

    // Start with activities that have no predecessors
    const starts = criticalActivities.filter(a => {
      const preds = dependencies.filter(d => d.successorId === a.id);
      return preds.length === 0;
    });

    if (starts.length === 0 && criticalActivities.length > 0) {
      // If no clear start, use the first critical activity
      this.buildPath(criticalActivities[0], criticalActivities, dependencies, path, visited);
    } else {
      for (const start of starts) {
        this.buildPath(start, criticalActivities, dependencies, path, visited);
      }
    }

    return path;
  }

  private buildPath(
    activity: Activity,
    criticalActivities: Activity[],
    dependencies: Dependency[],
    path: string[],
    visited: Set<string>
  ): void {
    if (visited.has(activity.id)) {
      return;
    }

    visited.add(activity.id);
    path.push(activity.code);

    // Find next critical activity
    const successors = dependencies
      .filter(d => d.predecessorId === activity.id)
      .map(d => criticalActivities.find(a => a.id === d.successorId))
      .filter(a => a !== undefined) as Activity[];

    for (const successor of successors) {
      this.buildPath(successor, criticalActivities, dependencies, path, visited);
    }
  }

  /**
   * Topological sort using Kahn's algorithm
   */
  private topologicalSort(activities: Activity[], dependencies: Dependency[]): Activity[] {
    const sorted: Activity[] = [];
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    // Initialize
    for (const activity of activities) {
      inDegree.set(activity.id, 0);
      adjList.set(activity.id, []);
    }

    // Build graph
    for (const dep of dependencies) {
      adjList.get(dep.predecessorId)!.push(dep.successorId);
      inDegree.set(dep.successorId, (inDegree.get(dep.successorId) || 0) + 1);
    }

    // Find start nodes (in-degree = 0)
    const queue: Activity[] = [];
    for (const activity of activities) {
      if (inDegree.get(activity.id) === 0) {
        queue.push(activity);
      }
    }

    // Process queue
    while (queue.length > 0) {
      const current = queue.shift()!;
      sorted.push(current);

      const neighbors = adjList.get(current.id) || [];
      for (const neighborId of neighbors) {
        inDegree.set(neighborId, inDegree.get(neighborId)! - 1);
        if (inDegree.get(neighborId) === 0) {
          const neighbor = activities.find(a => a.id === neighborId)!;
          queue.push(neighbor);
        }
      }
    }

    return sorted;
  }
}
