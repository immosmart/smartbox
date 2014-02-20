(function ( window, undefined ) {

  var profiles = {},
    logs = {},
    logNames = [],
    curPanelIndex = 0,
  // максимум логов на странице
    maxLogCount = 20,
    $logWrap,
    $logRow,
    Log,
    LogPanel;

  // append log wrapper to body
  $logWrap = $('<div></div>', {
    id: 'log'
  });

  $(function () {
    $logWrap.appendTo(document.body);
  });

  $logRow = $('<div></div>', {
    'class': 'log-row'
  });

  /**
   * LogPanel constructor
   * @param logName {String} name of log panel
   * @constructor
   */
  LogPanel = function ( logName ) {
    this.name = logName;
    this.logs = 0;
    this.states = {};

    var $wrapper = $('#log_' + this.name);

    this.$content = $wrapper.find('.log_content');
    this.$state = $wrapper.find('.log_states');

    // no need anymore
    $wrapper = null;
  };

  _.extend(LogPanel.prototype, {
    log: function log ( msg ) {
      var logRow = $logRow.clone(),
        $rows, length;
      this.logs++;
      msg = _.escape(msg);

      logRow.html(msg).appendTo(this.$content);
      if ( this.logs > maxLogCount ) {
        $rows = this.$content.find(".log-row");
        length = $rows.length;
        $rows.slice(0, length - maxLogCount).remove();
        this.logs = $rows.length;
      }
    },

    state: function state ( value, stateName ) {
      var state = this.states[stateName] || this.createState(stateName);
      state.textContent = stateName + ': ' + value;
    },

    createState: function ( stateName ) {
      var $state = document.createElement('div');
      $state.id = '#log_' + this.name + '_' + stateName;
      this.states[stateName] = $state;
      this.$state.append($state);

      return $state;
    }
  });

  var logPanelTemplate = '<div class="log_pane" id="log_<%=name%>">' +
                           '<div class="log_name">Log: <%=name%></div>' +
                           '<div class="log_content_wrap">' +
                            '<div class="log_content"></div>' +
                           '</div>' +
                           '<div class="log_states"></div>' +
                         '</div>';

  Log = {

    create: function ( logName ) {
      var logHtml = logPanelTemplate.replace(/<%=name%>/g, logName);
      $logWrap.append(logHtml);
      logs[logName] = new LogPanel(logName);
      logNames.push(logName);
      return logs[logName];
    },

    getPanel: function ( logName ) {
      logName = logName || 'default';
      return (logs[logName] || this.create(logName));
    }
  };

  /**
   * Public log API
   */
  window.SB.utils.log = {
    log: function ( msg, logName ) {
      Log.getPanel(logName).log(msg);
    },

    state: function ( msg, state, logName ) {
      Log.getPanel(logName).state(msg, state);
    },

    show: function ( logName ) {
      logName = logName || logNames[curPanelIndex];

      if ( !logName ) {
        curPanelIndex = 0;
        this.hide();
      } else {
        curPanelIndex++;
        $logWrap.show();
        $('.log_pane').hide();
        $('#log_' + logName).show();
      }
    },

    hide: function () {
      $logWrap.hide();
    },

    startProfile: function ( profileName ) {
      if ( profileName ) {
        profiles[profileName] = (new Date()).getTime();
      }
    },

    stopProfile: function ( profileName ) {
      if ( profiles[profileName] ) {
        this.log(profileName + ': ' + ((new Date()).getTime() - profiles[profileName]) + 'ms', 'profiler');
        delete profiles[profileName];
      }
    }
  };

  window.$$log = SB.utils.log.log;

})(this);

$(function () {
  var logKey = SB.config.logKey || 'tools';
  $(document.body).on('nav_key:' + logKey, function () {
    SB.utils.log.show();
  });
});

